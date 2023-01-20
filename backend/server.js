const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();
mongoose.set("strictQuery", false);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
        await user.save()
        res.status(201).json({message: "User registered with success"});
    } catch(error) {
        console.error(error);
        res.status(400).json({error});
    }      
})

app.post("/api/auth/login", async(req, res) => {
    const { email, password } = req.body;
    
    const checkUser = async (email) => {
        try {
            const user = await User.findOne({email:email});
            return user;
        }catch(error) {
            console.log(error);
        }
    }
    const user = await checkUser(email);
    const comparePassword = async (password, hash) => {
        try {
            return await bcrypt.compare(password, hash);
        }catch(error) {
            console.log(error);
            res.status(404).json(error);
        }
        return false;
    }
    if (user) {
        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {
            const randomToken = jwt.sign(
                { userId: user._id },
                "RANDOM_TOKEN_SECRET",
                { expiresIn: "24h" }
            )
            res.status(200).json({userId: user._id, token: randomToken});
        }
    }
    res.status(404).json("Bad request");
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
