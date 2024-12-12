const homeRouter = require('./home');
const notiRouter = require('./noti');
const searchRouter = require('./search');

function route(app) {
    app.use('/', homeRouter);
    app.use('/notifications', notiRouter);
    app.use('/search', searchRouter);
}

module.exports = route;