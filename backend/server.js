const express = require("express")
const app = express();

const cors = require("cors")

const port = 4000;
app.listen(port, () => {
    console.log("Connected to localhost ", port)
});