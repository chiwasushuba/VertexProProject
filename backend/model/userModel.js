// User Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqT1nFXt_nZYKVIx4coe2GFqo1lNqcM5OpRw&s"},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
