const userRouter = require('./user');
const siteRouter = require('./site');

function route(app) {
    app.use('/user', userRouter);
    app.use('/', siteRouter);
}

module.exports = route;