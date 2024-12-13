const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
// const db = require('../db');
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
    forgotPassword(req, res) {
        res.locals.title = 'Forgot assword';
        res.render('forgotpassword');
    }
    resetPassword(req, res) {
        res.locals.title = 'Reset password';
        res.render('resetpassword');
    }
}

module.exports = new authController();