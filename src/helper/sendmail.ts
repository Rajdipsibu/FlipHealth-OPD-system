import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  secure: true,
  host:'smtp.gmail.com',
  port:465,
  auth: {
    user: "drajdip321@gmail.com",
    pass: "ptxauhfhoovcxbrb"

  }
});

export const sendMail = (
  email: string,
  subject:string,
  html:string
) => {
  transporter.sendMail({
    to: email,
    subject: subject,
    html:html
  });
  console.log("Email send");
  
};
