require('dotenv').config()

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { bucket } = require('../utils/firebase'); // firebase bucket
const bcrypt = require("bcrypt");


const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '5d'})
}

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
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const uploadedFiles = {};
    const fileFields = ["profileImage", "nbiClearance", "fitToWork"];

    const uploadToFirebase = (file, folder) => {
      return new Promise((resolve, reject) => {
        const fileName = `${folder}${Date.now()}-${file.originalname}`;
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        blobStream.on("error", reject);
        blobStream.on("finish", async () => {
          try {
            await blob.makePublic();
            resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
          } catch (err) {
            reject(err);
          }
        });

        blobStream.end(file.buffer);
      });
    };

    const userFolder = `users/${user.email}/required/`;

    // Upload new files if provided
    for (const field of fileFields) {
      if (req.files?.[field]?.[0]) {
        uploadedFiles[field] = await uploadToFirebase(req.files[field][0], userFolder);
      }
    }

    // Update user fields
    const {
      firstName,
      lastName,
      middleName,
      gender,
      position,
      completeAddress,
      nbiRegistrationDate,
      nbiExpirationDate,
      fitToWorkExpirationDate,
      gcashNumber,
      gcashName,
      role,
    } = req.body;

    if (gcashNumber && isNaN(Number(gcashNumber))) {
      return res.status(400).json({ error: "Gcash number must be a valid number" });
    }

    const updatedData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(middleName && { middleName }),
      ...(gender && { gender }),
      ...(position && { position }),
      ...(completeAddress && { completeAddress }),
      ...(nbiRegistrationDate && { nbiRegistrationDate }),
      ...(nbiExpirationDate && { nbiExpirationDate }),
      ...(fitToWorkExpirationDate && { fitToWorkExpirationDate }),
      ...(gcashNumber && { gcashNumber }),
      ...(gcashName && { gcashName }),
      ...(role && { role }),
      ...uploadedFiles, // Add new uploaded files
    };

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });

  } catch (error) {
    console.error(error);
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
};

/**
 * ADMIN DASHBOARD FUNCTIONS
 */
const signup = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    const { email } = req.body;
    const uploadedFiles = {};
    const requiredFiles = ["profileImage", "nbiClearance", "fitToWork"];
    for (const fileField of requiredFiles) {
      if (!req.files?.[fileField]?.[0]) {
        return res.status(400).json({ error: `${fileField} is required` });
      }
    }

    const uploadToFirebase = (file, folder) => {
      return new Promise((resolve, reject) => {
        const fileName = `${folder}${Date.now()}-${file.originalname}`;
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        blobStream.on("error", reject);
        blobStream.on("finish", async () => {
          try {
            await blob.makePublic();
            resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
          } catch (err) {
            reject(err);
          }
        });

        blobStream.end(file.buffer);
      });
    };

    // user folder path
    const userFolder = `users/${email}/required/`;

    // Upload profileImage
    if (req.files?.profileImage?.[0]) {
      uploadedFiles.profileImage = await uploadToFirebase(req.files.profileImage[0], userFolder);
    }

    // Upload nbiClearance
    if (req.files?.nbiClearance?.[0]) {
      uploadedFiles.nbiClearance = await uploadToFirebase(req.files.nbiClearance[0], userFolder);
    }

    // Upload fitToWork
    if (req.files?.fitToWork?.[0]) {
      uploadedFiles.fitToWork = await uploadToFirebase(req.files.fitToWork[0], userFolder);
    }

    // Extract other body fields
    const {
      firstName,
      lastName,
      middleName,
      gender,
      position,
      completeAddress,
      nbiRegistrationDate,
      nbiExpirationDate,
      fitToWorkExpirationDate,
      gcashNumber,
      gcashName,
      password,
      role,
    } = req.body;

    if (gcashNumber && isNaN(Number(gcashNumber))) {
      return res.status(400).json({ error: "Gcash number must be a valid number" });
    }

    const user = await User.signup({
      firstName,
      lastName,
      middleName,
      gender,
      position,
      completeAddress,
      nbiRegistrationDate,
      nbiExpirationDate,
      fitToWorkExpirationDate,
      gcashNumber,
      gcashName,
      email,
      password,
      role: role || "user",
      profileImage: uploadedFiles.profileImage,
      nbiClearance: uploadedFiles.nbiClearance,
      fitToWork: uploadedFiles.fitToWork,
    });

    const token = createToken(user._id);

    res
      .status(201)
      .json({ message: "User created successfully", user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        verified: user.verified
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const login = async (req, res) => {
  try {
    const user = await User.login(req.body.email, req.body.password);

    const token = createToken(user._id);

    if(user.verified === false) {
      return res.status(401).json({ error: "User not verified. Please contact admin." });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
        verified: user.verified
      },
      token
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
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
};

const getAllAdminRole = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['admin', 'superAdmin'] } });
        if(users.length === 0) {
            return res.status(404).json({ message: 'No admin users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
};

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

// Change User Role
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "superAdmin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
};

const changeUserRequest = async (req, res) => {
    try {
        const { id } = req.params;
        // Set request to true
        const user = await User.findByIdAndUpdate(id, { request: true }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Automatically set request to false after 3 days (259200000 ms)
        setTimeout(async () => {
            await User.findByIdAndUpdate(id, { request: false });
        }, 259200000);

        res.status(200).json({ message: 'User request set to true', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to change password" });
  }
};

const getUserTime = async (req, res) => {
  try {
    const now = new Date();

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Manila", // Force PH time
    };

    const phtTime = new Intl.DateTimeFormat("en-PH", options).format(now);

    res.status(200).json({ utc: now.toISOString() });
  } catch (error) {
    console.error("Error generating server time:", error);
    res.status(500).json({ error: "Failed to get server time" });
  }
};

module.exports = {
    signup,
    login,
    getUsers,
    getUser,
    getAllUserRole,
    getAllAdminRole,
    updateUser,
    deleteUser,
    verifyUser,
    unverifyUser,
    changeUserRole,
    changeUserRequest,
    changeUserPassword,
    getUserTime
};
