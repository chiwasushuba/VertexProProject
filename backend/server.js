require("dotenv").config();
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors");

const app = express();



const port = 4000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
        console.log("Connected to localhost ", port)
        console.log("Connected to database")
    });
}).catch((e) => {
    console.log("message: ", e);
})
