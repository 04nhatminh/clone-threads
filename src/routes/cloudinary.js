const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/cloudinaryController');

router.post('/update-profile', updateProfile);

module.exports = router;
