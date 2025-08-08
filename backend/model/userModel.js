// User Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, default: '' },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    position: {type: String, enum: ["Coordinator", "Sampler", "Helper"], required: true },
    completeAddress: { type: String, required: true },
    nbiExpirationDate: { type: Date, required: true },
    fitToWorkExpirationDate: { type: Date, required: true },
    gcashNumber: { type: Number, required: true },
    gcashName: { type: String, required: true },
    profileImage: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqT1nFXt_nZYKVIx4coe2GFqo1lNqcM5OpRw&s"},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
