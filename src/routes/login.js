const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/login', loginController.logIn);
router.get('/signup', loginController.signUp);

module.exports = router;