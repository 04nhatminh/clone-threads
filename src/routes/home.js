const homeController = require('../controllers/homeController');
const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');

router.get('/all-threads', homeController.renderHome);
router.get('/following-threads', homeController.loadFollowingThreads);
router.post('/toggleLikes', homeController.toggleLikes);
router.post('/addComment', homeController.addComment);
router.get('/loadThreads', homeController.loadThreads);
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        isLogin: true,
    });
});
router.post('/login', homeController.login);
router.get('/', homeController.renderHome);
router.post('/', upload.single('image'), homeController.addNewThread);

module.exports = router;