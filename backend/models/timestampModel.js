const mongoose = require('mongoose');

const timestampSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out'],
    required: true
  },
  pictures: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
});

// TTL index
timestampSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Timestamp', timestampSchema);
