const homeController = require('../controllers/homeController');
const authController = require("../controllers/authController");
const { upload } = require('../middleware/upload');
const express = require("express");
const { body, getErrorMessage } = require("../controllers/validator");
const router = express.Router();

router.get("/login", authController.logInShow);
router.post(
  "/login",
  body("emailOrUsername")
    .trim()
    .notEmpty()
    .withMessage("Email or Username is required"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("login", { loginMessage: message });
    }
    next();
  },
  authController.logIn
);
router.get("/logout", authController.logOut);
router.get("/signup", authController.signUpShow);
router.post(
  "/signup",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("username")
    .matches(/^[a-z0-9._]{3,20}$/)
    .withMessage("Username must be 3-20 chars, only lowercase, numbers, dots, and underscores."),
  body("password").trim().notEmpty().withMessage("Password is required"),
  body("password")
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
    .withMessage(
        "Password must be 8-16 chars, containing at least 1 digit, 1 lowercase, 1 uppercase, 1 special char, no spaces."
    ),
  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("signup", { signupMessage: message });
    }
    next();
  },
  authController.signup
);

// router.post('/signup', authController.signUpHandle);
router.get("/signup2", authController.signUp2Show);
router.post("/signup2", authController.signUp2);
router.get("/forgot", authController.forgotPasswordShow);
router.post(
  "/forgot",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("forgot", { forgotMessage: message });
    }
    next();
  },
  authController.forgotPassword
);

router.get("/reset", authController.resetPasswordShow);
router.post(
  "/reset",
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),
  body("password").trim().notEmpty().withMessage("Password is required"),
  body("password")
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
    .withMessage(
        "Password must be 8-16 chars, containing at least 1 digit, 1 lowercase, 1 uppercase, 1 special char, and no spaces."
    ),
    body("confirmPassword").custom((confirmPassword, { req }) => {
    if (confirmPassword !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
    }),
  (req, res, next) => {
    let message = getErrorMessage(req);
    if (message) {
      return res.render("resetpassword", { resetMessage: message });
    }
    next();
  },
  authController.resetPassword
);

router.get('/all-threads', homeController.renderHome);
router.get('/following-threads', homeController.loadFollowingThreads);
router.post('/toggleLikes', homeController.toggleLikes);
router.post('/addComment', homeController.addComment);
router.get('/loadThreads', homeController.loadThreads);
router.get('/', homeController.renderHome);
router.post('/', upload.single('image'), homeController.addNewThread);

module.exports = router;