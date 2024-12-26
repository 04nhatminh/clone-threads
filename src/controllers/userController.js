const models = require("../models");

let userController = {};

userController.profilePage = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }

        const passportUser = req.user;
        const user = await models.User.findOne({
            where: { id: passportUser.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const threads = await models.Thread.findAll({
            where: { userId: user.id },
            attributes: ['id', 'content', 'imageUrl', 'createdAt'],
            order: [['updatedAt', 'DESC']],
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
                    as: 'follower',
                    attributes: ['id', 'fullName', 'username', 'avatarUrl'],
                }]
            }),
            models.Follow.findAll({
                where: { followerId: user.id },
                attributes: ['userId'],
                include: [{
                    model: models.User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'username', 'avatarUrl'],
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
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

userController.otherUserProfile = async (req, res) => {
    const { username } = req.params;

    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    const currentUser = req.user; 
    if (currentUser.username === username) {
        return res.redirect("/profile");
    }

    try {
        const user = await models.User.findOne({
            where: { username: username },
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
            thread.isLike = likes.some(like => like.threadId === thread.id && like.userId === currentUser.id);
        });

        const [followers, follows] = await Promise.all([
            models.Follow.findAll({
                where: { userId: user.id },
                attributes: ['followerId'],
                include: [{
                    model: models.User,
                    as: 'follower',
                    attributes: ['id', 'fullName', 'username', 'avatarUrl'],
                }]
            }),
            models.Follow.findAll({
                where: { followerId: user.id },
                attributes: ['userId'],
                include: [{
                    model: models.User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'username', 'avatarUrl'],
                }]
            })
        ]);

        const followersWithFollowBackStatus = await Promise.all(
            followers.map(async (follower) => {
                const followBack = await models.Follow.findOne({
                    where: {
                        userId: follower.followerId,
                        followerId: currentUser.id
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
                        followerId: currentUser.id
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

        const isFollow = await models.Follow.findOne({
            where: {
                userId: user.id,
                followerId: currentUser.id
            }
        });

        res.render("other-profile", {
            title: `${user.fullName} (@${user.username})`,
            isProfile: false,
            user: user,
            threads: threads,
            followers: followersWithFollowBackStatus,
            follows: followsWithFollowStatus,
            followerCount,
            followingCount,
            isFollow: !!isFollow,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

userController.Like = async (req, res) => {
    const threadId = parseInt(req.body.thread);

    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const currentUser = req.user; 
    const userId = currentUser.id;

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

        if (currentUser.id !== thread.userId) {
            await models.Notification.create({
                userId: thread.userId,
                fromId: userId,
                type: 'like',
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await models.Thread.update({ updatedAt: new Date() }, { where: { id: threadId } });

        res.json({ success: true, liked: !existingLike, likesCount, message: 'Like updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

userController.Comment = async (req, res) => {
    const threadId = parseInt(req.body.thread);
    const content = req.body.comment ? req.body.comment : '';
    
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const currentUser = req.user;
    const userId = currentUser.id;

    try {
        const thread = await models.Thread.findOne({ where: { id: threadId } });
        if (!thread) {
            return res.status(404).json({ success: false, message: 'Thread not found' });
        }

        if (!content.trim()) {
            return res.status(400).json({ success: false, message: 'Content cannot be empty' });
        }

        const newComment = await models.Comment.create({
            userId,
            threadId,
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (currentUser.id !== thread.userId) {
            await models.Notification.create({
                userId: thread.userId,
                fromId: userId,
                type: 'comment',
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await models.Thread.update({ updatedAt: new Date() }, { where: { id: threadId } });

        return res.json({ success: true, comment: newComment, message: 'Comment posted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

userController.follow = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    const currentUserId = req.user.id;

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

        if (currentUserId !== targetUserId) {
            await models.Notification.create({
                userId: targetUserId,
                fromId: currentUserId,
                type: 'follow',
                isRead: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

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