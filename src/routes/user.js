const express = require('express');
const router = express.Router();
const {
    init, profilePage, selfComment, selfLike, follow
} = require('../controllers/userController');

// Middleware
// router.use('/', init);

// Routes
router.get('/profile', profilePage);
router.post('/self-comment', selfComment);
router.post('/self-like', selfLike);
router.post('/follow', follow);

module.exports = router;