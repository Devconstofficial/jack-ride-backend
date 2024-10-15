import { createTransporter } from "../utils/mailer.js";// Not using due to credentials Issue
import nodemailer from "nodemailer";
const emailServices = {
    sendEmail(email, subject, body){
        var mail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID, // Your email id
                pass: process.env.EMAIL_PASSWORD // Your password
            }
        });
        var mailOptions = {
            from: "Power of Attorney",
            to: email,
            subject: subject,
            html: body
        };
     
        return mail.sendMail(mailOptions)
    }
}

export default emailServices