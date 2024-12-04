class loginController {
    logIn(req, res) {
        res.locals.title = 'Login';
        res.render('login');
    }
    signUp(req, res) {
        res.locals.title = 'signup';
        res.render('signup');
    }
}

module.exports = new loginController();