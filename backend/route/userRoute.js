// User Routes
const express = require('express');
const router = express.Router();
const {
    createUser,
    loginUser,
    getUsers,
    getUser
} = require('../controller/userController');

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
