const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const path = require("path");
const sauceRouter = require("./routers/sauce.router");

const userRouter = require("./routers/user.router");

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Connect to the database mongoDb
try {
    mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("connected to mongoose");
} catch(error) {
    console.error(error);
}

app.use("/api/auth", userRouter);
app.use("/api/sauces", sauceRouter);
module.exports = app;