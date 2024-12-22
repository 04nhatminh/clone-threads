const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const passport = require('passport');
const redisClient = require('./redisConfig');

// const nodemailer = require('nodemailer');
// const apiController = require('./apiController');
const models = require ('../models');

// const { Op } = require('sequelize');
// const { log, error } = require('console');

class authController {
    logInShow(req, res) {
        console.log('user', req.user);
        if(req.isAuthenticated()) {
            return res.redirect('/');//truyen them eeq.user
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
        passport.authenticate('local-signup', async (error, user) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return res.redirect('/signup');
            }
            // save user data to redis
            const { email, username, password } = user;
            const tempUserKey = `signup:${email}`;
            // hash password
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 8);
            try {
                await redisClient.set(tempUserKey, JSON.stringify({ username, password: hashedPassword }), {
                    EX: 30 * 60, // expire in 30 minutes
                });

                console.log('data saved in redis:', { username, username });
    
                // create verify link
                const { sign } = require('./jwt');
                const host = req.header('host');
                const verificationLink = `${req.protocol}://${host}/signup2?token=${sign(email)}&email=${email}`;
                // send verify email
                const mail = require('./mail');
                await mail.sendVerificationMail(user, host, verificationLink);

                return res.render('signup', { done: true });
            } catch (error) {
                return res.render('signup', { message: 'An error when we send verify email for you. Try again please!' });
            }
        })(req, res, next);
    }
    
    signUp2Show(req, res) {
        res.locals.title = 'Signup continued';
        const { email, token } = req.query;
        console.log('email:', email, 'token:', token);
        const { verify } = require('./jwt');
    
        if (!token || !verify(token)) {
            return res.render('signup2', { expired: true });
        }

        res.render('signup2', { email, token });
    }
    
    
    async signUp2(req, res) {
        const { email, token, displayname } = req.body; // get email, token, displayname from form
        if (!token) {
            return res.render('signup2', { message: 'Token .' });
        }
            // get session data
            const tempUserKey = `signup:${email}`;
            try {
                const tempUserData = await redisClient.get(tempUserKey);
                console.log('tempUserKey:', tempUserKey);
                console.log('Session data:', tempUserData);
                
                if (!tempUserData) {
                    return res.render('signup2', { message: 'session is expired. Please sign up again!' });
                }
                // get username, password from session data
                const { username, password } = JSON.parse(tempUserData);
                console.log('user', username, password, displayname, email);
                // register user
                await models.User.create({
                    email,
                    username,
                    password,
                    description: (displayname && displayname.trim() !== '') 
                        ? displayname 
                        : username,
                });
                // delete session
                await redisClient.del(tempUserKey);
        
                res.render('signup2', { done: true });
            } catch (error) {
                res.render('signup2', { message: 'Have a error, please try signup again!' });
        }
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
            const mail = require('./mail');
            mail.sendForgotPasswordMail(user, host, resetLink)
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