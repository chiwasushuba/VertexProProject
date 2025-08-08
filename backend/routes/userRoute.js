// User Routes
const express = require('express');
const router = express.Router();
const {
    createUser,
    loginUser,
    getUsers,
    getUser,
    getAllUserRole,
    getAllAdminRole,
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/role/user', getAllUserRole);
router.get('/role/admin', getAllAdminRole);

module.exports = router;
