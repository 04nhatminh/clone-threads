const models = require("../models");

let postController = {};

postController.threadPage = async (req, res) => {
    try {
        const threadId = parseInt(req.params.id || 1);
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        const userId = req.user.id;

        const thread = await models.Thread.findOne({
            where: { id: threadId },
            order: [['createdAt', 'DESC']],
        });

        if (!thread) {
            return res.status(404).send('Thread not found');
        }

        const author = await models.User.findOne({
            where: { id: thread.userId },
        });

        const comments = await models.Comment.findAll({
            where: { threadId: thread.id },
            include: [{
                model: models.User,
                as: 'user', 
                attributes: ['id', 'username', 'avatarUrl', 'fullName'],
            }],
            order: [['createdAt', 'DESC']]
        });

        const likes = await models.Like.findAll({
            where: { threadId: thread.id },
            include: [{
                model: models.User,
                as: 'user', 
                attributes: ['id', 'username'],
            }],
        });

        const formattedComments = comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            User: {  
                id: comment.user.id,
                username: comment.user.username,
                avatarUrl: comment.user.avatarUrl,
            }
        }));

        thread.isLiked = likes.some((like) => like.userId === userId);
        thread.likesCount = likes.length;
        thread.commentsCount = comments.length;

        res.render('post', {
            title: `${author.fullName} (@${author.username})`,
            thread,
            author,
            comments: formattedComments,
            likes,
        });
    } catch (error) {
        console.error('Error in threadPage:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = postController;