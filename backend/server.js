require("dotenv").config();
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors");

const app = express();



const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// User Routes
const userRoutes = require('./route/userRoute');
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Connected to localhost ", process.env.PORT);
        console.log("Connected to database")
    });
}).catch((e) => {
    console.log("message: ", e);
})
