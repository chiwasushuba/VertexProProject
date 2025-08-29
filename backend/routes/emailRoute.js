const express = require('express');
const router = express.Router();
const { sendEmail } = require('../controllers/emailController');
const uploadTemplate = require('../utils/uploadTemplate');

// POST /api/email/send
router.post('/send', uploadTemplate.single('file'), sendEmail);

module.exports = router;
