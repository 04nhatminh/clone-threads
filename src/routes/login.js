const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.get('/login', loginController.logIn);
router.get('/signup', loginController.signUp);
router.post('/signup', loginController.handleSignup);  // Xử lý đăng ký
router.get('/verify-email', loginController.verifyEmail);  // Xác thực email

module.exports = router;