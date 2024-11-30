class homeController {
    renderHome(req, res) {
        res.locals.title = 'Simple Threads';
        res.render('home');
    }

    renderNotification(req, res) {
        res.locals.title = 'Notifications';
        res.render('noti');
    }
}

module.exports = new homeController();