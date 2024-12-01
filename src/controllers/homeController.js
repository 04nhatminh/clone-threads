class homeController {
    renderHome(req, res) {
        res.render("home", {
            title: "Home • Threads",
            isHome: true,
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