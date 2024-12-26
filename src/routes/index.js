const homeRouter = require('./home');
const notiRouter = require('./noti');
const searchRouter = require('./search');
const userRouter = require('./user');
const cloudinaryRouter = require('./cloudinary');
const threadRouter = require('./post');

function route(app) {
    app.use('/', homeRouter);
    app.use('/notifications', notiRouter);
    app.use('/search', searchRouter);
    app.use('/', userRouter);
    app.use('/', cloudinaryRouter);
    app.use('/thread', threadRouter);
}

module.exports = route;