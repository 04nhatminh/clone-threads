const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const apiController = require('./apiController');
const models = require ('../models');
const { Op } = require('sequelize');
const { log, error } = require('console');

class authController {
    logInShow(req, res) {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.locals.title = 'Login';
        res.render('login', {loginMessage: req.flash('loginMessage')});
    }
    
    logIn(req, res, next) {
        let reqUrl = req.body.reqUrl ? req.body.reqUrl : '/';
        passport.authenticate('local-login', (error,user) => {
            if(!user) {
                return res.redirect('/login?reqUrl=${reqUrl}'); 
            }
            if(error){
                return next(error);
            }
            req.logIn(user, (error) =>{
                if(error) {return next(error)};
                req.session.cookie.maxAge = (20*60*1000);
                return res.redirect(reqUrl);
            });
        })(req, res, next);
    }

    logOut(req, res, next) {
        req.logOut((error) => {
            if (error) {return next(error);}
            res.redirect('/');
        });
    }

    isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect(`/login?returnUrl=${req.originalUrl}`);
    }

    signUpShow(req, res) {
        res.locals.title = 'Signup';
        res.render('signup', {signupMessage: req.flash('signupMessage')});
    }

    signup(req, res, next) {
        passport.authenticate('local-signup', (error, user) => {    
            console.log('user', user);  
            if(error) {
                return next(error);
            }      
            if(user) {
                return res.redirect('/signup');
            }
            return res.redirect('/login');
        })(req, res, next);
    }

    signUp2(req, res) {
        res.locals.title = 'Signup cont';
        res.render('signup2');
    }
    forgotPasswordShow(req, res) {
        res.locals.title = 'Forgot password';
        res.render('forgotpassword');
    }
    async forgotPassword(req, res) {
        let email = req.body.email;
        //kiem tra neu email ton tai
        //nguoc lai thong bao email khong ton tai
        let user = await models.User.findOne({where: {email}});
        if (user) {
            //tao link
            const { sign } = require('./jwt');
            const host = req.header('host');
            const resetLink = `${req.protocol}://${host}/reset?token=${sign(email)}&email=${email}`;
            //gui email
            const { sendForgotPasswordMail } = require('./mail');
            sendForgotPasswordMail(user, host, resetLink)
            .then((result) => {
                console.log('email has been sent');
                res.render('forgotpassword', {done: true});
            })
            .catch((error) => {
                console.log(error.statusCode);
                res.render('forgotpassword', {message: 'An error occurred while sending to your email. Please check your email!'});
            });
        } else {
            return res.render('forgotpassword', {message : 'Email is not exits!'});
        }
    }
    resetPasswordShow(req, res) {
        res.locals.title = 'Reset password';
        let email = req.query.email;
        let token = req.query.token;
        let { verify } = require('./jwt');
        if (!token || !verify(token)) {
            return res.render('resetpassword', {expired: true});
        } else {
            res.render('resetpassword', {email, token});
        }
    }

    async resetPassword(req, res) {
        let email = req.body.email;
        let token = req.body.token;
        let bcrypt = require('bcryptjs');
        let password = await bcrypt.hash(req.body.password, 8);
        // let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));

        await models.User.update({password}, {where: {email}});
        res.render('resetpassword', {done: true});
    }
}

module.exports = new authController();