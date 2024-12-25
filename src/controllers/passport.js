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

// xac thuc nguoi dung khi login
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "emailOrUsername", // Thay email thành emailOrUsername
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, emailOrUsername, password, done) => {
      try {
        if (!req.user) {
          //check email hoac username
          let user = await models.User.findOne({
            where: emailOrUsername.includes("@")
              ? { email: emailOrUsername }
              : { username: emailOrUsername },
          });
          if (!user) {
            return done(null, false, req.flash("loginMessage", "Email or Username does not exist!")
            );
          }
          //check password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, req.flash("loginMessage", "Invalid password")
            );
          }
          return done(null, user); // check ok
        }
        done(null, req.user); // if user is authenticated
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // check email
        let user = await models.User.findOne({ where: { email } });
        if (user) {
          return done(null, false, req.flash("signupMessage", "Email already exists!"));
        }
        // check username
        user = await models.User.findOne({ where: { username: req.body.username } });
        if (user) {
          return done(null, false, req.flash("signupMessage", "Username already exists!"));
        }
        //  create new tmpUser
        const tempUser = { email, username: req.body.username, password };
        // return tempUser
        done(null, tempUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
