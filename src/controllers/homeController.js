let controller = {};
const { where } = require('sequelize');
const sequelize = require('sequelize');
const models = require('../models');
const { use } = require('../routes/home');
const { hashPassword, comparePassword } = require('../utils/bcryptUtils');
const { uploadToCloudinary } = require('../middleware/upload');

controller.renderHome = async (req, res) => {
    const userId = isNaN(req.cookies.userId) ? null : parseInt(req.cookies.userId);
    const currentUser = await models.User.findOne({ where: { id: userId } });
    // const threads = await models.Thread.findAll({
    //     include: ['user', 'likes', 'comments'],
    //     order: [['createdAt', 'DESC']],
    // });

    // Lấy danh sách các thread mà người dùng hiện tại đã like
    const likedThreads = await models.Like.findAll({
        where: { userId: userId },
        attributes: ['threadId']
    });

    // Chuyển đổi danh sách likedThreads thành mảng các threadId
    const likedThreadIds = likedThreads.map(like => like.threadId);

    // res.locals.threads = threads;
    res.locals.currentUser = currentUser;
    res.locals.likedThreadIds = likedThreadIds;

    res.render("home", {
        title: "Home • Simple Threads",
        isHome: true,
        loggedIn: currentUser ? true : false,
        following: false,
    });
}

controller.loadThreads = async (req, res) => {
    const page = isNaN(req.query.page) ? 1 : parseInt(req.query.page);
    const userId = isNaN(req.cookies.userId) ? null : parseInt(req.cookies.userId);
    const threads = await models.Thread.findAll({
        include: ['user', 'likes', 'comments'],
        order: [['updatedAt', 'DESC']],
        limit: 10,
        offset: (page - 1) * 10,
    });

    res.json(threads.map(thread => {
        return {
            id: thread.id,
            content: thread.content,
            imageUrl: thread.imageUrl,
            user: {
                id: thread.user.id,
                username: thread.user.username,
                avatarUrl: thread.user.avatarUrl,
            },
            likes: thread.likes.length,
            comments: thread.comments.length,
            createdAt: thread.createdAt,
            liked: thread.likes.some(like => like.userId === userId),
        }
    }));
}

controller.loadFollowingThreads = async (req, res) => {
    const userId = isNaN(req.cookies.userId) ? null : parseInt(req.cookies.userId);
    const currentUser = await models.User.findOne({ where: { id: userId } });
    const following = await models.Follow.findAll({ where: { followerId: currentUser.id } });
    const followingUserIds = following.map(follow => follow.userId);
    // console.log("--------------------");
    // console.log(followingUserIds);
    // console.log("--------------------");
    const threads = await models.Thread.findAll({
        include: ['user', 'likes', 'comments'],
        order: [['updatedAt', 'DESC']],
        where: { userId: followingUserIds }
    });

    // Lấy danh sách các thread mà người dùng hiện tại đã like
    const likedThreads = await models.Like.findAll({
        where: { userId: userId },
        attributes: ['threadId']
    });

    // Chuyển đổi danh sách likedThreads thành mảng các threadId
    const likedThreadIds = likedThreads.map(like => like.threadId);

    res.locals.threads = threads;
    res.locals.currentUser = currentUser;
    res.locals.likedThreadIds = likedThreadIds;
    res.render("home", {
        title: "Home • Simple Threads",
        isHome: true,
        loggedIn: currentUser ? true : false,
        following: true,
    });
}

controller.addNewThread = async (req, res) => {
    try {
        console.log('Starting add new thread...');
        let imageUrl = null;

        if (req.file) {
            console.log('Uploading image to Cloudinary...');
            const uploadResult = await uploadToCloudinary(req.file.buffer, 'threads');
            console.log('Upload result:', uploadResult); // Log kết quả upload
            imageUrl = uploadResult.secure_url; // Lấy URL ảnh từ Cloudinary
        }

        console.log('Creating thread in database...');
        const newThread = await models.Thread.create({
            userId: isNaN(req.body.userId) ? null : parseInt(req.body.userId),
            content: req.body.content,
            imageUrl: imageUrl, // Lưu URL ảnh
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('Thread created:', newThread); // Log thông tin thread mới
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
        const thread = await models.Thread.findOne({ where: { id: threadId } });
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

        // Cập nhật lại trường updatedAt của thread dưới database
        await models.Thread.update(
            { id: threadId * 1 },
            { where: { id: threadId } }
        );

        // Tạo thông báo
        await models.Notification.create({
            userId: thread.userId,
            fromId: userId,
            type: 'like',
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.json({ success: true, liked: !existingLike, likesCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

controller.addComment = async (req, res) => {
    const threadId = parseInt(req.body.thread);
    const userId = parseInt(req.body.user);
    const content = req.body.comment;

    try {
        const thread = await models.Thread.findOne({ where: { id: threadId } });
        if (!thread) {
            return res.status(404).json({ success: false, message: 'Thread not found' });
        }

        const newComment = await models.Comment.create({
            userId,
            threadId,
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await models.Thread.update(
            { id: threadId * 1 },
            { where: { id: threadId } }
        );

        await models.Notification.create({
            userId: thread.userId,
            fromId: userId,
            type: 'comment',
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

controller.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Tìm user trong cơ sở dữ liệu
        let user = await models.User.findOne({ where: { email } });

        // Nếu không tìm thấy user, tạo user mới
        if (!user) {
            const hashedPassword = await hashPassword(password); // Mã hóa mật khẩu
            user = await models.User.create({
                email,
                username: email,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        // Xác minh mật khẩu
        // const isMatch = await comparePassword(password, user.password); // So sánh mật khẩu đã mã hóa
        // if (!isMatch) {
        //     return res.status(400).json({ success: false, message: 'Invalid password' });
        // }

        res.cookie('userId', user.id, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = controller;