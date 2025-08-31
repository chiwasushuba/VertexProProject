const express = require('express');
const router = express.Router();
const { sendEmail, sendId } = require('../controllers/emailController');
const uploadTemplate = require('../utils/uploadTemplate');

// POST /api/email/send
router.post('/send', uploadTemplate.single('file'), sendEmail);
router.post("/send-id", uploadTemplate.single('file'), sendId )

module.exports = router;
