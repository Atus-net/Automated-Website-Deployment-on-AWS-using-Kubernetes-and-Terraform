const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey', // fix cứng
            pass: process.env.SENDGRID_API_KEY, // key bên SendGrid
        },
    });

    const info = await transporter.sendMail({
        from: '"DolciLuxe" <dolciluxevn@gmail.com>',
        to,
        subject,
        html: htmlContent,
    });

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
