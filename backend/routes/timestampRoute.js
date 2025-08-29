const express = require('express');
const multer = require('multer');
const { uploadImage, getTimestamps, deleteImage, getTimestampsOfUser } = require('../controllers/timestampController');
const requireAuth = require('../middleware/requireAuth');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getTimestamps);
router.get('/user/:id', getTimestampsOfUser);

router.delete('/:id',deleteImage);

router.use(requireAuth);


router.post('/', upload.single('picture'), uploadImage);



module.exports = router;