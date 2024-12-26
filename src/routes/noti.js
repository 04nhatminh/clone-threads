const notiController = require('../controllers/notiController.js');
const express = require('express');
const router = express.Router();

router.get('/', notiController.renderNotification);
router.put('/mark-as-read', notiController.markAsRead);
router.delete('/delete', notiController.deleteNotification);

module.exports = router;