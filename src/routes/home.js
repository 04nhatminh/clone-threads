const homeController = require('../controllers/homeController');
const apiController = require('../controllers/apiController');
const loginController = require('../controllers/loginController');
const express = require('express');
const router = express.Router();

router.get('/login', loginController.logInShow);
router.post('/login', loginController.logIn);
// router.post('/login', loginController.logInHandle);
router.get('/signup', loginController.signUp);
// router.post('/signup', loginController.signUpHandle);
router.get('/signup2', loginController.signUp2);
router.get('/forgot-password', loginController.forgotPassword);
router.get('/reset-password', loginController.resetPassword);

router.get('/', homeController.renderHome);
router.post('/', homeController.renderHome);
router.get('/notifications', homeController.renderNotification);
router.get('/api/all-threads', apiController.loadAllThreads);
router.get('/api/following-threads', apiController.loadFollowingThreads);

module.exports = router;