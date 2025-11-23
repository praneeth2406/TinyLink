const {
  createLink,
  getLinkByCode,
  getAllLinks,
  deleteLink,
  incrementClick,
} = require('../models/linkModel');

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST /api/links
async function createLinkHandler(req, res) {
  try {
    let { url, code } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Custom code validation if provided
    if (code) {
      if (!CODE_REGEX.test(code)) {
        return res.status(400).json({
          error: 'Code must be 6-8 chars [A-Za-z0-9]',
        });
      }
      const existing = await getLinkByCode(code);
      if (existing) {
        return res.status(409).json({ error: 'Code already exists' });
      }
    } else {
      // Auto-generate unique code
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 10) {
        code = generateRandomCode(6);
        const existing = await getLinkByCode(code);
        if (!existing) isUnique = true;
        attempts++;
      }
      if (!isUnique) {
        return res
          .status(500)
          .json({ error: 'Failed to generate unique code' });
      }
    }

    const link = await createLink({ code, targetUrl: url });

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const shortUrl = `${baseUrl}/${link.code}`;

    return res.status(201).json({ ...link, shortUrl });
  } catch (err) {
    console.error('Error creating link', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/links
async function listLinksHandler(_req, res) {
  try {
    const links = await getAllLinks();
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const withShort = links.map((l) => ({
      ...l,
      shortUrl: `${baseUrl}/${l.code}`,
    }));
    return res.json(withShort);
  } catch (err) {
    console.error('Error listing links', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/links/:code
async function getStatsHandler(req, res) {
  try {
    const { code } = req.params;
    const link = await getLinkByCode(code);
    if (!link) {
      return res.status(404).json({ error: 'Not found' });
    }
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    return res.json({
      ...link,
      shortUrl: `${baseUrl}/${link.code}`,
    });
  } catch (err) {
    console.error('Error getting stats', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/links/:code
async function deleteLinkHandler(req, res) {
  try {
    const { code } = req.params;
    const deleted = await deleteLink(code);
    if (!deleted) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting link', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /:code (redirect)
async function redirectHandler(req, res) {
  try {
    const { code } = req.params;

    // Ignore reserved paths
    if (code === 'healthz' || code === 'api' || code === 'code') {
      return res.status(404).send('Not found');
    }

    const link = await incrementClick(code);
    if (!link) {
      return res.status(404).send('Not found');
    }
    return res.redirect(302, link.target_url);
  } catch (err) {
    console.error('Error redirecting', err);
    return res.status(500).send('Internal server error');
  }
}

module.exports = {
  createLinkHandler,
  listLinksHandler,
  getStatsHandler,
  deleteLinkHandler,
  redirectHandler,
};
