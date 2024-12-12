let controller = {};
const models = require('../models');
const { where } = require('sequelize');
const sequelize = require('sequelize');

controller.renderNotification = async (req, res) => {
    const userId = isNaN(req.cookies.userId) ? null : parseInt(req.cookies.userId);
    const currentUser = await models.User.findOne({ where: { id: userId } });
    
    const noti = await models.Notification.findAll({
        where: { userId: userId },
        order: [['isRead', 'ASC'], ['createdAt', 'DESC']],
        include: ['from'],
    });

    noti.forEach(notification => {
        switch (notification.type) {
            case 'comment':
                notification.message = 'commented on your thread.';
                break;
            case 'like':
                notification.message = 'liked your thread.';
                break;
            case 'follow':
                notification.message = 'started following you.';
                break;
            default:
                notification.message = 'You have a new notification.';
        }
    });

    res.locals.currentUser = currentUser;

    res.render('noti', {
        title: "Notifications • Simple Threads",
        noti,
        isNoti: true,
        loggedIn: currentUser ? true : false,
    });
}

controller.markAsRead = async (req, res) => {
    const { notiId } = req.body;
    console.log(notiId);

    try {
        const notification = await models.Notification.findOne({ where: { id: notiId } });
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        notification.isRead = true;
        await notification.save();

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

controller.deleteNotification = async (req, res) => {
    const { notiId } = req.body;
    console.log(notiId);

    try {
        const notification = await models.Notification.findOne({ where: { id: notiId } });
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        await notification.destroy();

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = controller;