const express = require('express');
const {
  createLinkHandler,
  listLinksHandler,
  getStatsHandler,
  deleteLinkHandler,
} = require('../controllers/linkController');

const router = express.Router();

router.post('/', createLinkHandler);
router.get('/', listLinksHandler);
router.get('/:code', getStatsHandler);
router.delete('/:code', deleteLinkHandler);

module.exports = router;
