const nodemailer = require('nodemailer');
const Email = require('../models/emailModel');

exports.sendEmail = async (req, res) => {
  const { to } = req.body;

  const subject = "Store Intro Letter from Vertex Pro Inc.";
  const text = "This is the store intro letter that you requested. Please find the attached document for more details.";
  const html = "<p>This is the store intro letter that you requested. Please find the attached document for more details.</p>";
  const file = req.file; // Multer stores file here

  try {
    // Log email as pending, include file if uploaded
    const emailDoc = await Email.create({
      to,
      subject,
      text,
      html,
      status: 'pending',
      file: file ? { data: file.buffer, name: file.originalname, mimeType: file.mimetype } : undefined
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
      attachments: file ? [{
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }] : []
    };

    await transporter.sendMail(mailOptions);

    emailDoc.status = 'sent';
    await emailDoc.save();

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error(err);

    await Email.create({
      to,
      subject,
      text,
      html,
      status: 'failed',
      error: err.message
    });

    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
};
