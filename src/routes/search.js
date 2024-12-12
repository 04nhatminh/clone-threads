const searchController = require('../controllers/searchController');
const express = require('express');
const router = express.Router();

router.get('/', searchController.renderSearch);

module.exports = router;