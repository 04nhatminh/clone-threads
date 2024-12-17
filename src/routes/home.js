const homeController = require('../controllers/homeController');
const apiController = require('../controllers/apiController');
const authController = require('../controllers/authController');
const express = require('express');
const { body, getErrorMessage } = require('../controllers/validator');
const router = express.Router();


router.get('/login', authController.logInShow);
router.post('/login',
    body('emailOrUsername').trim().notEmpty().withMessage('Email or Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        let message = getErrorMessage(req);
        if (message) {
            return res.render('login', { loginMessage: message });
        }
        next();
    },
    authController.logIn);
router.get('/logout', authController.logOut);
router.get('/signup', authController.signUpShow);
router.post('/signup', 
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        let message = getErrorMessage(req);
        if (message) {
            return res.render('signup', { signupMessage: message });
        }
        next();
    },
    authController.signup);  

// router.post('/signup', authController.signUpHandle);
router.get('/signup2', authController.signUp2);
router.get('/forgot', authController.forgotPasswordShow);
router.post('/forgot', authController.forgotPassword);

// router.get('/reset', authController.resetPasswordShow);
// router.post('/reset', authController.resetPassword);
router.use(authController.isLoggedIn);
router.get('/', homeController.renderHome);
router.post('/', homeController.renderHome);
router.get('/notifications', homeController.renderNotification);
router.get('/api/all-threads', apiController.loadAllThreads);
router.get('/api/following-threads', apiController.loadFollowingThreads);

module.exports = router;