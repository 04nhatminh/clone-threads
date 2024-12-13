const homeController = require('../controllers/homeController');
const apiController = require('../controllers/apiController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router.get('/login', authController.logInShow);
router.post('/login', authController.logIn);
router.get('/logout', authController.logOut);
// router.post('/login', authController.logInHandle);
router.get('/signup', authController.signUp);
// router.post('/signup', authController.signUpHandle);
router.get('/signup2', authController.signUp2);
router.get('/forgot-password', authController.forgotPassword);
router.get('/reset-password', authController.resetPassword);

router.get('/', homeController.renderHome);
router.post('/', homeController.renderHome);
router.get('/notifications', homeController.renderNotification);
router.get('/api/all-threads', apiController.loadAllThreads);
router.get('/api/following-threads', apiController.loadFollowingThreads);

module.exports = router;