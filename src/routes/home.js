const homeController = require('../controllers/homeController');
const express = require('express');
const router = express.Router();

router.get('/', homeController.renderHome);
router.post('/', homeController.addNewThread);
router.get('/notifications', homeController.renderNotification);
router.get('/all-threads', homeController.renderHome);
router.get('/following-threads', homeController.loadFollowingThreads);
router.post('/toggleLikes', homeController.toggleLikes);

module.exports = router;