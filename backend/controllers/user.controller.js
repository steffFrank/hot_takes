// User controller
const {getHashedPassword, saveUserInDb, checkUser, comparePassword, generateToken} = require("../utils");

// Register User
registerUser = async (req, res, saltRounds, User, bcrypt) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await getHashedPassword(password, saltRounds, bcrypt);
        await saveUserInDb(email, hashedPassword, User);
        res.status(201).json({message: "User registered with success"});
    } catch(error) {
        res.status(401).json({message: error});
    }

}

// Log user in with token
logUserIn = async (req, res, User, jwt, bcrypt) => {
    const { email, password } = req.body;
    try {
        const user = await checkUser(email, User);
        await comparePassword(password, user.password, bcrypt);
        const randomToken = generateToken(jwt, user._id);
        res.status(200).json({userId: user._id, token: randomToken});
    } catch(error) {
        console.log(error);
        res.status(404).json("Bad request");
    }
    res.status(404).json("Bad request");
}

module.exports = ({logUserIn, registerUser});
