const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
require("dotenv").config();
mongoose.set("strictQuery", false);

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




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
