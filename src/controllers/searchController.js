let controller = {};
const models = require('../models');
const { Op } = require('sequelize');

controller.renderSearch = async (req, res) => {
    const userId = isNaN(req.cookies.userId) ? null : parseInt(req.cookies.userId);
    const currentUser = await models.User.findOne({ where: { id: userId } });

    res.locals.currentUser = currentUser;

    res.render('search', {
        title: "Search • Simple Threads",
        isSearch: true,
        loggedIn: currentUser ? true : false,
    });
}

controller.loadUsers = async (req, res) => {
    const userId = isNaN(req.cookies.userId) ? null : parseInt(req.cookies.userId);
    const keywords = req.query.keywords;

    let options = { where: {} };

    if (keywords.trim() != "") {
        options.where[Op.or] = {
            username: { [Op.iLike]: `%${keywords.trim()}%` },
            description: { [Op.iLike]: `%${keywords.trim()}%` },
        }
    }

    try {
        const users = await models.User.findAll({
            where: {
                id: { [Op.ne]: userId },
                ...options.where,
            },
            include: ['follows', 'followers'],
        });

        res.json(users.map(user => {
            return {
                id: user.id,
                username: user.username,
                avatarUrl: user.avatarUrl,
                description: user.description || '',
                followers: user.follows.length || 0,
                followed: user.follows.some(follower => follower.followerId === userId),
            };
        }));
    } catch (error) {
        console.error('Error when load users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

controller.follow = async (req, res) => {
    const userId = parseInt(req.body.target);
    const followerId = parseInt(req.body.follower);

    try {
        const follow = await models.Follow.findOne({
            where: {
                userId: userId,
                followerId: followerId,
            }
        });

        if (follow) {
            await follow.destroy();
            res.json({ success: true, message: 'Unfollowed' });
        } else {
            await models.Follow.create({
                userId: userId,
                followerId: followerId,
            });
            res.json({ success: true, message: 'Followed' });
        }
    } catch (error) {
        console.error('Error when follow:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = controller;