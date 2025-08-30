// utils/cleanup.js
const cron = require("node-cron");
const Timestamp = require("../models/timestampModel");
const { bucket } = require("./firebase");

// Run every midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup job...");

  const now = new Date();

  // Find all expired docs
  const expiredDocs = await Timestamp.find({ expiresAt: { $lte: now } });

  for (const doc of expiredDocs) {
    // Delete each picture from Firebase
    for (const picUrl of doc.pictures) {
      try {
        const path = picUrl.split(`/${bucket.name}/`)[1]; // get relative file path
        await bucket.file(path).delete();
        console.log(`Deleted from Firebase: ${path}`);
      } catch (err) {
        console.error("Error deleting from Firebase:", err.message);
      }
    }

    // Delete MongoDB doc
    await Timestamp.findByIdAndDelete(doc._id);
    console.log(`Deleted MongoDB record for user: ${doc.user}`);
  }
});
