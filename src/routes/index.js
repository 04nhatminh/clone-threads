const userRouter = require('./user');
const homeRouter = require('./home');

function route(app) {
    app.use('/user', userRouter);
    app.use('/', homeRouter);
}

module.exports = route;