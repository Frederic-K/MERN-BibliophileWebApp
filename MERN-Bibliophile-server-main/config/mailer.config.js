import config from "../config/config.js"
import nodemailer from "nodemailer"

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Hostinger SMTP server
    port: 465, // Port for SSL
    secure: true, // Use SSL
    auth: {
      user: config.emailUser, // Your email address
      pass: config.emailPass, // Your password
    },
  })

  return transporter
}

export default createTransporter
