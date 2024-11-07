class homeController {
    renderHome(req, res) {
        res.render('home');
    }
}

module.exports = new homeController();