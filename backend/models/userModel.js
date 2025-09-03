// User Model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    company_id: { type: String, unique: true }, // auto-generated like VP0001
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superAdmin','admin', 'user'], default: 'user' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, default: '' },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    position: {type: String, enum: ["Coordinator", "Sampler", "Helper", "Brand Ambassador", "Push Girl"], required: true },
    completeAddress: { type: String, required: true },
    nbiClearance: { type: String, required: true }, // FILE PATH
    nbiRegistrationDate: { type: Date, required: true },
    nbiExpirationDate: { type: Date, required: true },
    fitToWork: { type: String, required: true }, // FILE PATH
    fitToWorkExpirationDate: { type: Date, required: true },
    gcashNumber: { type: Number, required: true },
    gcashName: { type: String, required: true },
    birthdate: { type: Date, required: true},
    profileImage: { type: String, required: true}, // FILE PATH
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    requestLetter: { type: Boolean, default: false },
    requestId: {type: Boolean, default: false},
    governmentId: {type: String, required: true}, // FILE PATH
    governmentIdType: {type: String, enum: ["SSS", "PhilHealth", "UMID", "PhilSys", "Driver's License", "Passport"], required: true}
});

userSchema.statics.signup = async function(userData) {
    const requiredFields = [
        "email", "password", "firstName", "lastName",
        "gender", "position", "completeAddress", "nbiRegistrationDate",
        "nbiExpirationDate", "fitToWorkExpirationDate",
        "gcashNumber", "gcashName", "birthdate"
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

    // Generate company_id (VP0001, VP0002, etc.)
    const lastUser = await this.findOne().sort({ createdAt: -1 }).exec();
    let newIdNumber = 1;

    if (lastUser && lastUser.company_id) {
        const lastNumber = parseInt(lastUser.company_id.replace("VP", ""), 10);
        newIdNumber = lastNumber + 1;
    }

    const company_id = `VP${String(newIdNumber).padStart(4, "0")}`;

    // Create user
    const user = await this.create({
        ...userData,
        password: hash,
        company_id
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
