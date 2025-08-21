// User Routes
const express = require('express');
const router = express.Router();
const upload = require('../utils/requireUpload'); // your multer config

const {
    signup,
    login,
    getUsers,
    getUser,
    getAllUserRole,
    getAllAdminRole,
} = require('../controllers/userController');

// Signup with profile image upload
router.post('/signup', upload.single("image"), signup);

router.post('/login', login);

// Get users
router.get('/', getUsers);
router.get('/:id', getUser);

// Get by role
router.get('/role/user', getAllUserRole);
router.get('/role/admin', getAllAdminRole);

module.exports = router;

