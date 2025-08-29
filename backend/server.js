require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoute");
const timestampRoutes = require("./routes/timestampRoute");
const emailRoutes = require("./routes/emailRoute");
require("./utils/cleanup");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/timestamp', timestampRoutes);
app.use('/api/email', emailRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Connected to localhost ", process.env.PORT);
        console.log("Connected to database")
    });
}).catch((e) => {
    console.log("message: ", e);
})
