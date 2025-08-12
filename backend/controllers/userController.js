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


// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




/**
 * 
 * ADMIN DASHBOARD FUNCTIONS
 * 
 */


const signup = async (req, res) => {
    try{
        const user = new User.signup(req.body);
        res.status(200).json({ message: "User created successfully", user });  
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const user = new User.login(req.body.email, req.body.password);
        res.status(200).json({ message: "Login successful", user });
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

const verifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { verified: true }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } 

        res.status(200).json({ message: 'User verified successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const unverifyUser = async (req, res) => {
    try {
        const { id } = req.params;  
        const user = await User.findByIdAndUpdate(id, { verified: false }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User unverified successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

module.exports = {
    signup,
    login,
    getUsers,
    getUser,
    getAllUserRole,
    getAllAdminRole
}