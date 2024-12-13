const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
// const db = require('../db');
const apiController = require('./apiController');
const models = require ('../models');
const { Op } = require('sequelize');
const { log, error } = require('console');

class loginController {
    logInShow(req, res) {
        res.locals.title = 'Login';
        res.render('login', {loginMessage: req.flash('loginMessage')});
    }
    
    logIn(req, res, next) {
        passport.authenticate('local-login', (error,user) => {
            if(!user) {
                return res.redirect('/login'); 
            }
            if(error){
                return next(error);
            }
            req.logIn(user, (error) =>{
                if(error) {return next(error)};
                console.log("login success")
                // req.session.cookie.maxAge = (20*60*1000);
                return res.redirect('/');
            });
        })(req, res, next);
    }

    logOut(req, res, next) {
        req.logOut((error) => {
            if (error) {return next(error);}
            res.redirect('/');
        });
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