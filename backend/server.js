const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();
mongoose.set("strictQuery", false);
const bcrypt = require("bcrypt");
const user = require("./models/user");
const saltRounds = 10;

try {
    mongoose.connect(process.env.MONGODB_CONNECTION);
    console.log("connected to mongoose");
} catch(error) {
    console.error(error);
}


app.use(express.json());
app.use(cors());

app.post("/api/auth/signup", async (req, res) => {
    const { email, password } = req.body;
    const passwordHash = async (password, saltRounds) => {
        try {
            const generatedSalt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, generatedSalt);
        } catch(error) {
            console.error(error);
        } 
    }
    const hashedPassword = await passwordHash(password, saltRounds);

    const user = User({
        email:email,
        password: hashedPassword
    });

    try {
        const response = await user.save()
        console.log(response);
        res.status(201).json({message: "User registered with success"});
    } catch(error) {
        console.log(error);
        res.status(400).json({error});
    }      
})





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
