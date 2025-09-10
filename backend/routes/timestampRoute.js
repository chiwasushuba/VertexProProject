const express = require('express');
const multer = require('multer');
const {
  getTimestampsOut,
  getTimestampsIn,
  deleteImage,
  getTimestampsOfUser,
  deleteSingleImage,
  uploadTimestampIn, uploadTimestampOut
} = require('../controllers/timestampController');
const requireAuth = require('../middleware/requireAuth');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/out', getTimestampsOut);
router.get('/in', getTimestampsIn);
router.get('/user/:id', getTimestampsOfUser);

router.delete('/:id', deleteImage);
router.delete("/:id/image", deleteSingleImage);

router.use(requireAuth);

router.post('/in', upload.single('picture'), uploadTimestampIn);
router.post('/out', upload.single('picture'), uploadTimestampOut);



module.exports = router;