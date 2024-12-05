class loginController {
    logIn(req, res) {
        res.locals.title = 'Login';
        res.render('login');
    }
    signUp(req, res) {
        res.locals.title = 'Signup';
        res.render('signup');
    }
    signUp2(req, res) {
        res.locals.title = 'Signup cont';
        res.render('signup2');
    }
    forgotPassword(req, res) {
        res.locals.title = 'Forgot assword';
        res.render('forgotpassword');
    }
    resetPassword(req, res) {
        res.locals.title = 'Reset password';
        res.render('resetpassword');
    }
}

module.exports = new loginController();