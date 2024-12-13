const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const models = require("../models");

//ham nay thuc hien khi xac thuc thanh cong va
//luu thong tin user vao session
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// ham duoc goi boi passport.session de lay thong tin nguoi dung tu csdl dưa vào req.user
passport.deserializeUser(async (id, done) => {
  console.log("Call hehe");
  try {
    let user = await models.User.findOne({
      attributes: ["id", "email", "username"],
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

//ham xac thuc nguoi dung khi dang nhap
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "emailOrUsername", // Thay email thành emailOrUsername
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, emailOrUsername, password, done) => {
      if (emailOrUsername) {
        emailOrUsername = emailOrUsername.trim(); // Xóa khoảng trắng đầu , cuối
      }
      try {
        if (!req.user) {
          // Kiểm tra người dùng đã đăng nhập chưa
          let user = await models.User.findOne({
            where: emailOrUsername.includes('@') 
              ? { email: emailOrUsername }
              : { username: emailOrUsername },
          });
          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Email or Username does not exist!")
            );
          }
          // Kiểm tra mật khẩu có khớp không
          const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
            return done(
                null,
                false,
                req.flash("loginMessage", "Invalid password")
            );
            }

          return done(null, user); // Xác thực thành công
        }
        done(null, req.user); // Nếu người dùng đã đăng nhập, trả về thông tin người dùng
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
