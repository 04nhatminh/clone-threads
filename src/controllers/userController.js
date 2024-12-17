const models = require("../models");
const { QueryTypes } = require("sequelize");
const { comparePassword } = require("../utils/bcryptUtils");

let userController = {};

userController.init = (req, res, next) => {
    res.locals.email = req.cookies.email;
    res.locals.password = req.cookies.password;
    res.locals.isLoggedIn = req.session.isLoggedIn ? req.session.isLoggedIn : false;
    // console.log('Request Body:', req.body);
    console.log('Log in Session:', req.session.isLoggedIn);
    console.log('Email Cookies:', req.cookies.email);
    console.log('Password Cookies:', req.cookies.password);

    next();
}

userController.profilePage = async (req, res) => {
    try {
        const userId = 1;
        const user = await models.User.findOne({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const threads = await models.Thread.findAll({
            where: { userId: user.id },
            attributes: ['id', 'content', 'imageUrl', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });

        const threadIds = threads.map(thread => thread.id);
        const likes = await models.Like.findAll({
            where: { threadId: threadIds },
            attributes: ['userId', 'threadId'],
        });

        const comments = await models.Comment.findAll({
            where: { threadId: threadIds },
            attributes: ['userId', 'threadId', 'content', 'createdAt'],
            order: [['createdAt', 'ASC']],
        });

        threads.forEach(thread => {
            thread.likes = likes.filter(like => like.threadId === thread.id);
            thread.comments = comments.filter(comment => comment.threadId === thread.id);
            thread.isLike = likes.some(like => like.threadId === thread.id && like.userId === user.id);
        });

        const [followers, follows] = await Promise.all([
            models.Follow.findAll({
                where: { userId: user.id },
                attributes: ['followerId'],
                include: [{
                    model: models.User,
                    as: 'follower', // This is the alias for the follower
                    attributes: ['id', 'fullName', 'username', 'avatarUrl'], // Include follower's user data
                }]
            }),
            models.Follow.findAll({
                where: { followerId: user.id },
                attributes: ['userId'],
                include: [{
                    model: models.User,
                    as: 'user', // This is the alias for the user being followed
                    attributes: ['id', 'fullName', 'username', 'avatarUrl'], // Include followed user's data
                }]
            })
        ]);

        const followersWithFollowBackStatus = await Promise.all(
            followers.map(async (follower) => {
                const followBack = await models.Follow.findOne({
                    where: {
                        userId: follower.followerId,
                        followerId: user.id
                    }
                });

                return {
                    ...follower.follower.dataValues,
                    isFollowBack: !!followBack
                };
            })
        );

        const followsWithFollowStatus = await Promise.all(
            follows.map(async (follow) => {
                const isFollow = await models.Follow.findOne({
                    where: {
                        userId: follow.userId,
                        followerId: user.id
                    }
                });

                return {
                    ...follow.user.dataValues,
                    isFollow: !!isFollow
                };
            })
        );

        const followerCount = followers.length;
        const followingCount = follows.length;

        res.render("profile", {
            title: `${user.fullName} (@${user.username})`,
            isProfile: true,
            user: user,
            threads: threads,
            followers: followersWithFollowBackStatus,
            follows: followsWithFollowStatus,
            followerCount,
            followingCount,
            currentUser: user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

userController.selfLike = async (req, res) => {
    const threadId = parseInt(req.body.thread);
    const userId = parseInt(req.body.userId);

    try {
        const thread = await models.Thread.findOne({ where: { id: threadId } });
        if (!thread) {
            return res.status(404).json({ success: false, message: 'Thread not found' });
        }

        const existingLike = await models.Like.findOne({
            where:
            {
                userId: userId,
                threadId: threadId
            }
        });

        if (existingLike) {
            await existingLike.destroy();
        } else {
            await models.Like.create({ userId, threadId });
        }

        const likesCount = await models.Like.count({ where: { threadId } });

        res.json({ success: true, liked: !existingLike, likesCount, message: 'Like updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

userController.selfComment = async (req, res) => {
    const threadId = parseInt(req.body.thread);
    const userId = parseInt(req.body.userId);
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

        return res.json({ success: true, comment: newComment, message: 'Comment posted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

userController.follow = async (req, res) => {
    const currentUserId = parseInt(req.body.currentUserId); 
    const targetUserId = parseInt(req.body.targetUserId);   

    try {
        const existingFollow = await models.Follow.findOne({
            where: {
                userId: targetUserId,     
                followerId: currentUserId  
            }
        });

        if (existingFollow) {
            await existingFollow.destroy();
            return res.json({
                success: true,
                followed: false,
                message: 'Unfollowed successfully'
            });
        }

        await models.Follow.create({
            userId: targetUserId,     
            followerId: currentUserId  
        });

        return res.json({
            success: true,
            followed: true,
            message: 'Followed successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = userController;