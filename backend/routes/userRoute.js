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
    updateUser,
    deleteUser,
    verifyUser,
    unverifyUser,
    changeUserRole
} = require('../controllers/userController');
const requireAuth = require('../middleware/requireAuth');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/signup', signup);
router.post('/login', login);

router.use(requireAuth); // below are the endpoints that require authentication

router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/role/user', getAllUserRole);
router.get('/role/admin', getAllAdminRole);
router.patch('/verify/:id', verifyUser);
router.patch('/unverify/:id', unverifyUser);
router.patch('/changerole/:id', unverifyUser);

module.exports = router;
