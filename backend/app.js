const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

const userRouter = require("./routers/user.router");

app.use(express.json());
app.use(cors());

// Connect to the database mongoDb
try {
    mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("connected to mongoose");
} catch(error) {
    console.error(error);
}

app.use("/api/auth", userRouter);


module.exports = app;