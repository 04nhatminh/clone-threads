const siteController = require('../controllers/siteController');
const express = require('express');
const router = express.Router();

router.get('/', siteController.renderHome);

module.exports = router;