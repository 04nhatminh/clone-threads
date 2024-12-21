const express = require('express');
const router = express.Router();

const { threadPage } = require('../controllers/postController');

router.get('/:id', threadPage);  

module.exports = router;