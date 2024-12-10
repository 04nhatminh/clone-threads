const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db');
const apiController = require('./apiController');
const models = require ('../models');
const { Op } = require('sequelize');

class loginController {
    logIn(req, res) {
        res.locals.title = 'Login';
        res.render('login');
    }
    
    async logInHandle(req, res) {
        const { emailOrUsername, password } = req.body;
        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: 'Email/Username và Password là bắt buộc.' });
        }
        try {
            // Kiểm tra xem người dùng có tồn tại trong DB không
            const user = await models.User.findOne({
                where: {
                    [Op.or]: [
                        { email: emailOrUsername }, // Tìm bằng email
                        { username: emailOrUsername } // Tìm bằng username
                    ]
                }
            });

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or username' });
            }

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Incorrect password' });
            }

            // Lưu thông tin user vào session (hoặc cookie nếu cần)
            // req.session.userId = user.id;
            // req.session.username = user.username;

            // Sau khi đăng nhập thành công, chuyển hướng đến trang chủ
            res.redirect('/');
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    signUp(req, res) {
        res.locals.title = 'Signup';
        res.render('signup');
    }


    // async handleSignup(req, res) {
    //     const { email, username, password } = req.body;

    //     try {
    //         // Kiểm tra email hoặc username đã tồn tại
    //         const existingUser = await db.query(
    //             'SELECT * FROM User WHERE email = ? OR username = ?',
    //             [email, username]
    //         );

    //         if (existingUser.length > 0) {
    //             return res.status(400).json({ error: 'Email hoặc Username đã tồn tại.' });
    //         }

    //         // Mã hóa mật khẩu
    //         const hashedPassword = await bcrypt.hash(password, 10);

    //         // Lưu thông tin tạm thời của người dùng vào bảng `PendingUsers`
    //         await db.query(
    //             'INSERT INTO PendingUsers (email, username, password) VALUES (?, ?, ?)',
    //             [email, username, hashedPassword]
    //         );

    //         // Tạo mã token ngẫu nhiên
    //         const token = crypto.randomBytes(32).toString('hex');
    //         const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    //         // Lưu token vào bảng `ConfirmationTokens`
    //         await db.query(
    //             'INSERT INTO ConfirmationTokens (email, token, expires_at) VALUES (?, ?, ?)',
    //             [email, token, expiry]
    //         );

    //         // Tạo liên kết xác thực
    //         const confirmationLink = `http://localhost:3000/verify-email?token=${token}`;

    //         // Gửi email xác thực
    //         const transporter = nodemailer.createTransport({
    //             service: 'gmail',
    //             auth: {
    //                 user: 'pvminh22@clc.fitus.edu.vn', // Thay bằng email của bạn
    //                 pass: 'jobi ugot wrkd wonc', // Thay bằng mật khẩu ứng dụng
    //             },
    //         });

    //         await transporter.sendMail({
    //             from: '"Simple Threads" <pvminh22@clc.fitus.edu.vn>',
    //             to: email,
    //             subject: 'Xác nhận tài khoản',
    //             html: `<p>Chào ${username},</p>
    //                     <p>Vui lòng nhấn vào liên kết bên dưới để hoàn tất bước đăng ký:</p>
    //                     <a href="${confirmationLink}">${confirmationLink}</a>
    //                     <p>Liên kết này sẽ hết hạn sau 10 phút.</p>`,
    //         });

    //         res.status(201).json({ success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.' });
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ error: 'Lỗi hệ thống.' });
    //     }
    // }

    // // Xử lý xác thực qua liên kết
    // async verifyEmail(req, res) {
    //     const { token } = req.query;

    //     try {
    //         const result = await db.query(
    //             'SELECT * FROM ConfirmationTokens WHERE token = ? AND expires_at > NOW()',
    //             [token]
    //         );

    //         if (result.length === 0) {
    //             return res.status(400).json({ error: 'Liên kết không hợp lệ hoặc đã hết hạn.' });
    //         }

    //         const email = result[0].email;

    //         // Chuyển thông tin từ `PendingUsers` sang `User`
    //         const pendingUser = await db.query('SELECT * FROM PendingUsers WHERE email = ?', [email]);
    //         if (pendingUser.length > 0) {
    //             const { username, password } = pendingUser[0];
    //             await db.query(
    //                 'INSERT INTO User (email, username, password) VALUES (?, ?, ?)',
    //                 [email, username, password]
    //             );

    //             // Xóa thông tin khỏi `PendingUsers` và `ConfirmationTokens`
    //             await db.query('DELETE FROM PendingUsers WHERE email = ?', [email]);
    //             await db.query('DELETE FROM ConfirmationTokens WHERE email = ?', [email]);
    //         }

    //         // Chuyển hướng đến bước đăng ký thứ hai
    //         res.redirect('/signup2');
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ error: 'Lỗi hệ thống.' });
    //     }
    // }

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