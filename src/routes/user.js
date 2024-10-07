const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.logIn);
router.get('/signup', userController.signUp);

module.exports = router;