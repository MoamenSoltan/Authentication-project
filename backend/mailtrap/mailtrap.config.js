import { MailtrapClient }  from "mailtrap";


import dotenv from "dotenv";
dotenv.config()
//needed to use environment variables

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",//changed email here
  name: "Mailtrap Test",
};



// const recipients = [
//   {
//     email: "moamensoltan@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     html: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);