const homeController = require('../controllers/homeController');
const apiController = require('../controllers/apiController');
const express = require('express');
const router = express.Router();

router.get('/', homeController.renderHome);
router.post('/', homeController.renderHome);
router.get('/notifications', homeController.renderNotification);
router.get('/api/all-threads', apiController.loadAllThreads);
router.get('/api/following-threads', apiController.loadFollowingThreads);

module.exports = router;