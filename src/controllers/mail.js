const Mailjet = require("node-mailjet");

class mail{

  sendForgotPasswordMail(user, host, resetLink) {
    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "phamminh0973@gmail.com",
            Name: "Simple threads Group 06",
          },
          To: [
            {
              Email: user.email,
              Name: user.username,
            },
          ],
          Subject: "Simple Threads 06 - Reset Password",
          HTMLPart: `
                  <p>Hi ${user.username},</p>
                  <br>
                  <p>You recently requested to reset the password for your ${host} account. Click the link below to proceed.</p>
                  <br>
                  <p><a href="${resetLink}">Reset Password</a></p>
                  <br>
                  <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.</p>
                  <br>
                  <p>Thanks,</p>
                  <p>Simple Threads group 06</p>`,
        },
      ],
    });
    return request;
  }

  sendVerificationMail(user, host, verificationLink) {
    const mailjet = Mailjet.apiConnect(
      process.env.MJ_APIKEY_PUBLIC,
      process.env.MJ_APIKEY_PRIVATE
    );

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "phamminh0973@gmail.com",
            Name: "Simple threads Group 06",
          },
          To: [
            {
              Email: user.email,
              Name: user.username,
            },
          ],
          Subject: "Simple Threads 06 - Verify your email",
          HTMLPart: `
            <p>Hi ${user.username},</p>
            <br>
            <p>Thank you for signing up! Please click the link below to verify your email address and complete the signup process.</p>
            <br>
            <p><a href="${verificationLink}">Verify your email</a></p>
            <br>
            <p>If you did not sign up for this account, please ignore this email.</p>
            <br>
            <p>Thanks,</p>
            <p>Simple Threads group 06</p>
          `,
        },
      ],
    });
    return request;
  }
}
module.exports = new mail();
