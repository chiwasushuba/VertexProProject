const { bucket } = require('../utils/firebase');
const Timestamp = require('../models/timestampModel');

const getTimestamps = async (req, res) => {
  try {
    const timestamps = await Timestamp.find().sort({ createdAt: -1 });
    res.status(200).json(timestamps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const email = req.user.email; 
    const file = req.file;
    const userId = req.user._id; // Get user ID from auth middleware
    const folderName = `users/${email}/uploads/`;
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

        // Find or create Timestamp document for this user
        let timestampDoc = await Timestamp.findOne({ user: userId });
        if (!timestampDoc) {
          timestampDoc = await Timestamp.create({
            user: userId,
            pictures: [pictureUrl],
          });
        } else {
          timestampDoc.pictures.push(pictureUrl);
          await timestampDoc.save();
        }

        res.status(201).json(timestampDoc);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    blobStream.end(file.buffer);
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
      await bucket.file(path).delete();
    }

    // Delete Mongo doc
    await Timestamp.findByIdAndDelete(id);

    res.status(200).json({ message: 'Timestamp and files deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTimestampsOfUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from auth middleware
    const timestamps = await Timestamp.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(timestamps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  getTimestamps,
  uploadImage,
  deleteImage,
  getTimestampsOfUser
};
