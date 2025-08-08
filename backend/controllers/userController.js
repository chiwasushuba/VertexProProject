// User Controller
const User = require('../models/userModel');

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single user by ID
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }   

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Register a new user
const createUser = async (req, res) => {
    try {
        const {
            email,
            password,
            role,
            firstName,
            lastName,
            middleName,
            gender,
            position,
            completeAddress,
            nbiExpirationDate,
            fitToWorkExpirationDate,
            gcashNumber,
            gcashName,
            profileImage
        } = req.body;

        // Basic required field check
        if (!email || !password || !firstName || !lastName || !gender || !position || !completeAddress || !nbiExpirationDate || !fitToWorkExpirationDate || !gcashNumber || !gcashName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create new user
        const user = new User({
            email,
            password, // In production, hash this before saving
            role,
            firstName,
            lastName,
            middleName,
            gender,
            position,
            completeAddress,
            nbiExpirationDate,
            fitToWorkExpirationDate,
            gcashNumber,
            gcashName,
            profileImage
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully", user });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllUserRole = async (req , res) => {
    try {
        const users = await User.find({ role: 'user' });

        if(users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}

const getAllAdminRole = async (req, res) => {
    try {
        const users = await User.find({ role: 'admin' });   

        if(users.length === 0) {
            return res.status(404).json({ message: 'No admin users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    createUser,
    loginUser,
    getUsers,
    getUser,
    getAllUserRole,
    getAllAdminRole
}