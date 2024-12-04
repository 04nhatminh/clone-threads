class koginController {
    logIn(req, res) {
        res.render('login');
    }
    signUp(req, res) {
        res.render('signup');
    }
}

module.exports = new userController();