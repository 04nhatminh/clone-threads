
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const models = require('../models');

//ham nay thuc hien khi xac thuc thanh cong va 
//luu thong tin user vao session
passport.serializeUser((user, done) =>{
        done(null, user.id);
});
// ham duoc goi boi passport.session de lay thong tin nguoi dung tu csdl dưa vào req.user
passport.deserializeUser(async(id,done) =>{
    try{
        let user = await models.User.findOne({
            attributes: ['id', 'email' , ' username'],
            where: {id}
        });
        done(null,user);
    } catch (error) {
        done(error, null);
    }
})

//ham xac thuc nguoi dung khi dang nhap
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallBack: true // cho phep req truyen vao callback de kiem tra nguoi dung dang nhap chua
}, (req, email, password, done) =>{
    if(email){
        email= email.toLowerCase();
    }
    try {
        if (!req.user){//neu chua dang nhap
            let user= models.User.findOne({where: {email}});
            if(!user){//neu eamil chua ton tai
                return done(null, false, req.flash('loginMessage', 'Email dose not exist! '));
            }
            if (!bcrypt.compareSync(password, user.password)){// neu sai mk
                return done(null, false, req.flash('loginMessage', 'Invalid password '));
            }
            return done(null, user);
        }
        done(null, req.user);
    } catch (error) {
        done(error);
    }
}
))

module.exports = passport;















