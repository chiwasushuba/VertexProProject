const mongoose = require('mongoose');

const timestampSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pictures: [{
    type: String, 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: { // new field
    type: Date,
    default: () => Date.now() + 7*24*60*60*1000 // 7 days from now
  }
});

// Time To Live Index, mongoDB automatically deletes after expiresAt
timestampSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Timestamp', timestampSchema);
