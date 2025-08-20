const transporter = require('../config/emailConfig');

function formatDateTime(date) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use 12-hour clock
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };

    return new Intl.DateTimeFormat('default', options).format(date);
}

const currentDateTime = formatDateTime(new Date());
console.log(currentDateTime);


async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: '"Asher Fraz" <ash3rdev@gmail.com>',
            to,
            subject,
            html
        });
        console.log(">>>: Email sent to:", to, ", Email id: ", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

function sendPasswordResetEmail(user, resetLink) {
    const subject = "🔒 Reset Your Password - Notes App";
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset</title>
        <meta author="Asher Fraz" />
      <style>
        body { background-color: #f6f9fc; font-family: 'Helvetica Neue', sans-serif; margin: 0; padding: 0; }
        .email-wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .email-content { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .email-header { background-color: #155dfc; color: #fff; padding: 24px; text-align: center; }
        .email-header h1 { margin: 0; font-size: 24px; }
        .email-body { padding: 32px 24px; }
        .email-body p { font-size: 16px; color: #555; line-height: 1.6; }
        .button { display: inline-block; margin-top: 16px; padding: 10px 20px; background-color: #ffff; color: #000; border: 1px solid #155dfc; text-decoration: none; border-radius: 4px; font-weight: bold; }
        .email-footer { background-color: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-content">
          <div class="email-header">
              <div class="logo">📝 Notes App</div>
            <h1>Password Reset Request</h1>
          </div>
          <div class="email-body">
            <p>Hello, ${user.fname}</p>
            <p>We received a request to reset your password for your Notes App account.</p>
            <p>Click the button below to reset your password:</p>
            <p><a href="${resetLink}" class="button">Reset Password</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p><strong>Request Time:</strong> ${formatDateTime(new Date())}</p>
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} Notes App. All rights reserved.</p>
            <p>Developed by <a href="https://asherfraz.com" target="_blank">Asher Fraz</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    console.log(`>>>: Password Reset Email sent to ${user.email}`);
    sendEmail(user.email, subject, html);
}

function sendWelcomeEmail(user) {
    const subject = "🎉 Welcome to Notes App!";
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome Email</title>
      <meta author="Asher Fraz" />
      <style>
        body { background-color: #f6f9fc; font-family: 'Helvetica Neue', sans-serif; margin: 0; padding: 0; }
        .email-wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .email-content { background-color: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .email-header { background-color: #155dfc; color: #fff; padding: 24px; text-align: center; }
        .email-header h1 { margin: 0; font-size: 24px; }
        .email-body { padding: 32px 24px; }
        .email-body p { font-size: 16px; color: #555; line-height: 1.6; }
        .email-footer { background-color: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-content">
          <div class="email-header">
            <h1>Welcome, ${user.fname}!</h1>
          </div>
          <div class="email-body">
            <p>We're thrilled to have you on board at <strong>Notes App</strong>.</p>
            <p>Start capturing your thoughts, ideas, and tasks with ease.</p>
            <p>If you have any questions, feel free to reach out to our team.</p>
            <p><strong>Signup Time:</strong> ${formatDateTime(new Date())}</p>
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} Notes App. All rights reserved.</p>
            <p>Developed by <a href="https://asherfraz.com" target="_blank">Asher Fraz</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    console.log(`>>>: Welcome Email sent to ${user.email}`);
    sendEmail(user.email, subject, html);
}

function sendLoginNotificationEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Login Notification</title>
        <meta author="Asher Fraz" />
        <style>
          body {background-color: #f6f9fc;margin: 0;padding: 0;font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;}
          .email-wrapper {max-width: 600px;margin: 0 auto;padding: 40px 20px;}
          .email-content {background-color: #ffffff;border-radius: 8px;overflow: hidden;box-shadow: 0 2px 6px rgba(0,0,0,0.05);}
          .email-header {
            background-color: #155dfc;
            color: #ffffff;
            padding: 24px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
          }
          .email-body {
            padding: 32px 24px;
          }
          .email-body h2 {
            margin-top: 0;
            font-size: 20px;
            color: #333;
          }
          .email-body p {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
          }
          .email-footer {
            background-color: #f1f5f9;
            padding: 16px 24px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
          .logo {
            font-weight: bold;
            font-size: 18px;
            letter-spacing: 1px;
          }
          a.button {
            display: inline-block;
            margin-top: 16px;
            padding: 10px 20px;
            background-color: #155dfc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-content">
            <div class="email-header">
              <div class="logo">📝 Notes App</div>
            </div>
            <div class="email-body">
              <h2>Hello ${user.fname},</h2>
              <p>We detected a new login to your Notes App account. If this was you, there's nothing else you need to do.</p>
              <p>If you did not log in, please <a href="https://localhost:5173/forgot-password" class="button">secure your account</a> immediately by changing your password.</p>
              <p><strong>Login Time:</strong> ${formatDateTime(new Date())}</p>
            </div>
            <div class="email-footer">
              <p>You’re receiving this email because your account was accessed. If this wasn’t you, please contact support immediately.</p>
              <p>&copy; ${new Date().getFullYear()} Notes App. All rights reserved.</p>
              <p>Developed & Deployed by <a href="https://asherfraz.com" target="_blank">Asher Fraz</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;
    const subject = "🔐 New Login Notification - Notes App";

    console.log(`>>>: Login Notification Email sent to ${user.email}`);
    sendEmail(user.email, subject, html);
}

function sendPasswordChangedNotificationEmail(user) {
    const subject = "✅ Your Password Was Changed - Notes App";
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Changed</title>
      <style>
        body { background-color: #f6f9fc; font-family: 'Helvetica Neue', sans-serif; margin: 0; padding: 0; }
        .email-wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .email-content { background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .email-header { background-color: #2563eb; color: #ffffff; padding: 24px; text-align: center; }
        .email-header h1 { margin: 0; font-size: 24px; }
        .email-body { padding: 32px 24px; }
        .email-body h2 { margin-top: 0; font-size: 20px; color: #333; }
        .email-body p { font-size: 16px; color: #555; line-height: 1.6; }
        .email-footer { background-color: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #6b7280; text-align: center; }
        a.button {
          display: inline-block;
          margin-top: 16px;
          padding: 10px 20px;
          background-color: #ef4444;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-content">
          <div class="email-header">
            <h1>Password Changed</h1>
          </div>
          <div class="email-body">
            <h2>Hello ${user.fname},</h2>
            <p>This is a confirmation that your Notes App password was successfully changed.</p>
            <p>If you made this change, no further action is needed.</p>
            <p>If you did <strong>not</strong> change your password, please <a href="https://localhost:5173/forgot-password" class="button">secure your account</a> immediately.</p>
            <p><strong>Change Time:</strong> ${formatDateTime(new Date())}</p>
          </div>
          <div class="email-footer">
            <p>If you didn’t make this change, contact support immediately.</p>
            <p>&copy; ${new Date().getFullYear()} Notes App. All rights reserved.</p>
            <p>Developed by <a href="https://asherfraz.com" target="_blank">Asher Fraz</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    console.log(`>>>: Password Changed Notification Email sent to ${user.email}`);
    sendEmail(user.email, subject, html);
}



module.exports = { sendEmail, sendPasswordResetEmail, sendWelcomeEmail, sendLoginNotificationEmail, sendPasswordChangedNotificationEmail };
