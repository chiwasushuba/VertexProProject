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
    updateUser,
    deleteUser,
    verifyUser,
    unverifyUser,
    changeUserRole,
    changeUserRequestLetter,
    changeUserPassword,
    getUserTime,
    changeUserRequestId
} = require('../controllers/userController');

// Signup with profile image upload
// userRoute.js
router.post(
  "/signup",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "nbiClearance", maxCount: 1 },
    { name: "fitToWork", maxCount: 1 },
    { name: "governmentId", maxCount: 1}
  ]),
  signup
);


// Login
router.post('/login', login);

// Get users
router.get('/', getUsers);
router.get('/time', getUserTime)

// Get by role (placed BEFORE /:id to avoid conflicts)
router.get('/role/user', getAllUserRole);
router.get('/role/admin', getAllAdminRole);

// Get single user
router.get('/:id', getUser);


// Update user

router.patch(
  '/:id',
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "nbiClearance", maxCount: 1 },
    { name: "fitToWork", maxCount: 1 },
  ]),
  updateUser
)


router.patch('/verify/:id', verifyUser);
router.patch('/unverify/:id', unverifyUser);
router.patch('/changerole/:id', changeUserRole);
router.patch("/changeRequestLetter/:id", changeUserRequestLetter)
router.patch("/changeRequestId/:id", changeUserRequestId)
router.patch("/changepassword/:id", changeUserPassword)
// Delete user
router.delete('/:id', deleteUser);

module.exports = router;
