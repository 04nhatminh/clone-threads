
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
});

//ham xac thuc nguoi dung khi dang nhap
passport.use('local-login', new LocalStrategy({
    usernameField: 'emailOrUsername',  // Thay email thành emailOrUsername
    passwordField: 'password',
    passReqToCallBack: true
}, async (req, emailOrUsername, password, done) => {
    if (emailOrUsername) {
        emailOrUsername = emailOrUsername.toLowerCase();  // Chuyển emailOrUsername thành chữ thường
    }
    try {
        if (!req.user) {  // Kiểm tra người dùng đã đăng nhập chưa
            let user = await models.User.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrUsername },  // Kiểm tra nếu khớp với email
                        { username: emailOrUsername }  // Kiểm tra nếu khớp với username
                    ]
                }
            });

            if (!user) {  // Nếu không tìm thấy người dùng
                return done(null, false, req.flash('loginMessage', 'Email or Username does not exist!'));
            }

            // Kiểm tra mật khẩu có khớp không
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, req.flash('loginMessage', 'Invalid password'));
            }

            return done(null, user);  // Xác thực thành công
        }
        done(null, req.user);  // Nếu người dùng đã đăng nhập, trả về thông tin người dùng
    } catch (error) {
        done(error);
    }
}));


module.exports = passport;















