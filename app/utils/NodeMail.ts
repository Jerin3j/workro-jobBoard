const nodemailer = require("nodemailer");

export async function NodeMail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Workro!" <${process.env.GMAIL_USER}>`,
    to,
    subject,
  };

  return transporter.sendMail(mailOptions);
}
