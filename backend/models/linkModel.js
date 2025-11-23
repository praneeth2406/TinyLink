const db = require('../db');

async function createLink({ code, targetUrl }) {
  const result = await db.query(
    `INSERT INTO links (code, target_url)
     VALUES ($1, $2)
     RETURNING id, code, target_url, total_clicks, last_clicked_at, created_at`,
    [code, targetUrl]
  );
  return result.rows[0];
}

async function getLinkByCode(code) {
  const result = await db.query(
    `SELECT id, code, target_url, total_clicks, last_clicked_at, created_at
     FROM links
     WHERE code = $1`,
    [code]
  );
  return result.rows[0];
}

async function getAllLinks() {
  const result = await db.query(
    `SELECT id, code, target_url, total_clicks, last_clicked_at, created_at
     FROM links
     ORDER BY created_at DESC`
  );
  return result.rows;
}

async function deleteLink(code) {
  const result = await db.query(
    `DELETE FROM links WHERE code = $1 RETURNING id`,
    [code]
  );
  return result.rows[0];
}

async function incrementClick(code) {
  const result = await db.query(
    `UPDATE links
     SET total_clicks = total_clicks + 1,
         last_clicked_at = NOW()
     WHERE code = $1
     RETURNING id, code, target_url, total_clicks, last_clicked_at`,
    [code]
  );
  return result.rows[0];
}

module.exports = {
  createLink,
  getLinkByCode,
  getAllLinks,
  deleteLink,
  incrementClick,
};
