import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { configDotenv } from "dotenv";
configDotenv();

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = Nodemailer.createTransport(
    MailtrapTransport({
        token: TOKEN,
    })
);

export const sender = {
    address: "hello@demomailtrap.com",
    name: "Viral Jain",
};


// const recipients = [
//     "veerljain1234@gmail.com",
// ];

// transport
//     .sendMail({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);