class homeController {
    renderHome(req, res) {
        console.log('user', req.user);
        res.render("home", {
            title: "Home • Threads",
            isHome: true,
            user: req.user,
        });
    }

    renderNotification(req, res) {
        res.render('noti', {
            title: 'Notifications',
            isNoti: true,
        });
    }
}

module.exports = new homeController();