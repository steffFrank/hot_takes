const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

try {
    mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("connected to mongoose");
} catch(error) {
    console.error(error);
}


app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
