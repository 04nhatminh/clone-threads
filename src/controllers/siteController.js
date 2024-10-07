class siteController {
    renderHome(req, res) {
        res.render('home');
    }
}

module.exports = new siteController();