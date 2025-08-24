// User Model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    nbiRegistrationDate: { type: Date, required: true },
    nbiExpirationDate: { type: Date, required: true },
    fitToWorkExpirationDate: { type: Date, required: true },
    gcashNumber: { type: Number, required: true },
    gcashName: { type: String, required: true },
    profileImage: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqT1nFXt_nZYKVIx4coe2GFqo1lNqcM5OpRw&s"},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
});

userSchema.statics.signup = async function(userData) {
    const requiredFields = [
        "email", "password", "firstName", "lastName",
        "gender", "position", "completeAddress", "nbiExpirationDate",
        "nbiExpirationDate", "fitToWorkExpirationDate",
        "gcashNumber", "gcashName"
    ];

    for (const field of requiredFields) {
        if (!userData[field]) {
            throw new Error(`${field} is required`);
        }
    }

    const exists = await this.findOne({ email: userData.email });
    if (exists) {
        throw new Error("Email already in use");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await this.create({
        ...userData,
        password: hash
    });

    return user;
};


userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }   

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);
