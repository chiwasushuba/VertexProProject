const { bucket } = require('../utils/firebase');
const Timestamp = require('../models/timestampModel');

// ======================
// GET FUNCTIONS
// ======================

const getTimestampsOut = async (req, res) => {
  try {
    const timestamps = await Timestamp.find({ type: 'out' }).sort({ createdAt: -1 });
    res.status(200).json(timestamps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTimestampsIn = async (req, res) => {
  try {
    const timestamps = await Timestamp.find({ type: 'in' }).sort({ createdAt: -1 });
    res.status(200).json(timestamps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTimestampsOfUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const timestamps = await Timestamp.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(timestamps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// UPLOAD FUNCTIONS
// ======================

const uploadTimestamp = async (req, res, type) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const email = req.user.email;
    const file = req.file;
    const userId = req.user._id;

    // Separate folders for in/out
    const folderName = `users/${email}/uploads/${type}/`;
    const fileName = `${folderName}${Date.now()}-${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (err) => {
      return res.status(500).json({ error: err.message });
    });

    blobStream.on("finish", async () => {
      try {
        await blob.makePublic();
        const pictureUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

        // Create new timestamp doc
        const timestampDoc = await Timestamp.create({
          user: userId,
          type,
          pictures: [pictureUrl],
        });

        res.status(201).json({ timestampDoc, pictureUrl });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadTimestampIn = (req, res) => uploadTimestamp(req, res, 'in');
const uploadTimestampOut = (req, res) => uploadTimestamp(req, res, 'out');

// ======================
// DELETE FUNCTIONS
// ======================

const deleteSingleImage = async (req, res) => {
  try {
    const timestampId = req.params.id;
    const { imageUrl } = req.body; // must pass imageUrl in body

    const timestamp = await Timestamp.findById(timestampId);
    if (!timestamp) {
      return res.status(404).json({ error: 'Timestamp not found' });
    }

    // Remove from array
    const index = timestamp.pictures.indexOf(imageUrl);
    if (index === -1) {
      return res.status(404).json({ error: 'Image not found in array' });
    }
    timestamp.pictures.splice(index, 1);

    // Extract the relative path from Firebase URL
    const path = imageUrl.split(`/${bucket.name}/`)[1];
    if (path) {
      await bucket.file(path).delete();
    }

    await timestamp.save();

    res.status(200).json({ message: 'Image deleted successfully', timestamp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const timestamp = await Timestamp.findById(id);

    if (!timestamp) {
      return res.status(404).json({ error: 'Timestamp not found' });
    }

    // Delete files from Firebase
    for (const picUrl of timestamp.pictures) {
      const path = picUrl.split(`/${bucket.name}/`)[1];
      if (path) {
        await bucket.file(path).delete();
      }
    }

    // Delete Mongo doc
    await Timestamp.findByIdAndDelete(id);

    res.status(200).json({ message: 'Timestamp and files deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================
// EXPORTS
// ======================

module.exports = {
  getTimestampsOut,
  getTimestampsIn,
  getTimestampsOfUser,
  uploadTimestampIn,
  uploadTimestampOut,
  deleteSingleImage,
  deleteImage,
};
