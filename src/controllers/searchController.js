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
            include: ['followers'],
        });

        res.json(users.map(user => ({
            username: user.username,
            avatarUrl: user.avatarUrl,
            description: user.description || '',
            followers: user.followers.length || [],
        })));
    } catch (error) {
        console.error('Error when load users:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = controller;