const nodemailer = require('nodemailer');

// Tạo transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pvminh@clc.fitus.edu.vn', // Email của bạn
        pass: 'jobi ugot wrkd wonc', // Mật khẩu ứng dụng thay vì mật khẩu thông thường
    },
});

// Gửi email
transporter.sendMail({
    from: '"Simple Threads" <pvminh@clc.fitus.edu.vn>', // Địa chỉ gửi
    to: "phamminh0973@gmail.com", // Địa chỉ nhận
    subject: "Quên mật khẩu", // Chủ đề
    text: "Đây là nội dung email!", // Nội dung dạng text
    html: "<b>Đây là nội dung email dạng HTML!</b>", // Nội dung dạng HTML
}).then(info => {
    console.log("Email sent successfully:", info);
}).catch(error => {
    console.error("Error sending email:", error);
});
