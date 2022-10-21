const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    console.log("Sending email to " + email);
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent successfully");
    } catch (error) {
        console.log(error, "email not sent");
        throw error;
    }
};

module.exports = sendEmail;
