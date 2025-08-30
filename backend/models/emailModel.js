const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String },
  html: { type: String },
  error: { type: String },
  file: {
    data: Buffer,
    name: String,
    mimeType: String
  },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

emailSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

module.exports = mongoose.model('Email', emailSchema);
