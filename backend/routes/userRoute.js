// User Routes
const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    getUsers,
    getUser,
    getAllUserRole,
    getAllAdminRole,
    signup,
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/signup', signup);
router.post('/login', login);
router.get('/role/user', getAllUserRole);
router.get('/role/admin', getAllAdminRole);

module.exports = router;
