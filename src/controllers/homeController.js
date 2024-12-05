let controller = {};
const { where } = require('sequelize');
const models = require('../models');
const { use } = require('../routes/home');
controller.renderHome = async (req, res) => {
    const threads = await models.Thread.findAll({ include: [ 'user', 'likes', 'comments' ] });
    const currentUser = await models.User.findOne( { where: { id: 1 } });
    res.locals.threads = threads;
    res.locals.currentUser = currentUser;
    res.render("home", {
        title: "Home • Simple Threads",
        isHome: true,
        loggedIn: currentUser ? true : false,
        following: false,
    });
}

controller.loadFollowingThreads = async (req, res) => {
    const currentUser = await models.User.findOne( { where: { id: 1 } });
    const following = await models.Follow.findAll({ where: { followerId: currentUser.id } });
    const followingUserIds = following.map(follow => follow.userId);
    // console.log("--------------------");
    // console.log(followingUserIds);
    // console.log("--------------------");
    const threads = await models.Thread.findAll({ 
        include: [ 'user', 'likes', 'comments' ], 
        where: { userId: followingUserIds } 
    });
    res.locals.threads = threads;
    res.locals.currentUser = currentUser;
    res.render("home", {
        title: "Home • Simple Threads",
        isHome: true,
        loggedIn: currentUser ? true : false,
        following: true,
    });
}

controller.renderNotification = (req, res) => {
    res.render('noti', {
        title: 'Notifications',
        isNoti: true,
    });
}

controller.addNewThread = async (req, res) => {
    try {
        const newThread = await models.Thread.create({
            userId: isNaN(req.body.userId) ? null : parseInt(req.body.userId),
            content: req.body.content,
            imageUrl: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Cannot add new thread');
    }
}

controller.toggleLikes = async (req, res) => {
    const threadId = parseInt(req.body.thread);
    const userId = parseInt(req.body.user);
    console.log(threadId, userId);

    try {
        const thread = await models.Thread.findOne( {where: { id: threadId }} );
        if (!thread) {
            return res.status(404).json({ success: false, message: 'Thread not found' });
        }

        // Kiểm tra xem user đã like chưa
        const existingLike = await models.Like.findOne({
            where: 
            { 
                userId: userId,
                threadId: threadId 
            }
        });

        if (existingLike) {
            // Nếu đã like, thì unlike
            await existingLike.destroy();
        } else {
            // Nếu chưa like, thì thêm like
            await models.Like.create({ userId, threadId });
        }

        // Lấy lại số lượng likes sau khi thay đổi
        const likesCount = await models.Like.count({ where: { threadId } });

        res.json({ success: true, liked: !existingLike, likesCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = controller;