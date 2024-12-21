const express = require('express');
const router = express.Router();
const {
    init, profilePage, Comment, Like, follow, otherUserProfile
} = require('../controllers/userController');

// Middleware
// router.use('/', init);

// Routes
router.get('/profile', profilePage);
router.get('/@:username', otherUserProfile);
router.post('/comment', Comment);
router.post('/like', Like);
router.post('/follow', follow);

module.exports = router;