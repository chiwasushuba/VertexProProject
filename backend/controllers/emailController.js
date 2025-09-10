const nodemailer = require('nodemailer');
const Email = require('../models/emailModel');

const sendEmail = async (req, res) => {
  const { to } = req.body;

  const subject = "Store Intro Letter from VertexPro";
  const text = "This is the store intro letter that you requested. Please find the attached document for more details.";
  const html = "<p>This is the store intro letter that you requested. Please find the attached document for more details.</p>";
  const file = req.file; // Multer stores file here

  try {
    // Save email in DB
    const emailDoc = await Email.create({
      to,
      subject,
      text,
      html,
      status: 'pending',
      file: file ? { data: file.buffer, name: file.originalname, mimeType: file.mimetype } : undefined
    });

    let attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
      attachments
    });

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

const sendId = async (req, res) => {
  const { to } = req.body;

  const subject = "ID Card from VertexPro";
  const text = "This is the ID card that you requested. Please find the attached document for more details.";
  const html = `<p>This is the ID card that you requested. Please find the attached document for more details.</p><br/>
  <p>Please have your ID printed as size CR80 2.125' x 3.375'. Ensure to insert your 1 x 1 photo and have it laminated.</p>
  `;
  const file = req.file; // Multer stores file here

  try {
    // Save email in DB
    const emailDoc = await Email.create({
      to,
      subject,
      text,
      html,
      status: 'pending',
      file: file ? { data: file.buffer, name: file.originalname, mimeType: file.mimetype } : undefined
    });

    // Prepare attachments (no conversion)
    let attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
      attachments
    });

    emailDoc.status = 'sent';
    await emailDoc.save();

    res.status(200).json({ message: 'ID email sent successfully' });
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

    res.status(500).json({ message: 'Failed to send ID email', error: err.message });
  }
};

module.exports = {
  sendEmail,
  sendId
};
