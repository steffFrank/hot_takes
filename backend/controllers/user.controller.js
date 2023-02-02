// User controller
const {getHashedPassword, saveUserInDb, getUser, comparePassword, generateToken, validateUser} = require("../utils");
const 
// Register User
registerUser = async (req, res, saltRounds, User, bcrypt) => {
    try {
        const {error, value} = validateUser(req.body.email, req.body.password);
        if (error) {
            return res.status(401).json({message: error.message})
        }
        console.log(error);
        const {email, password} = value;
        const hashedPassword = await getHashedPassword(password, saltRounds, bcrypt);
        await saveUserInDb(email, hashedPassword, User);
        res.status(201).json({message: "User registered with success"});
    } catch(error) {
        res.status(401).json({message: error});
    }
}

// Log user in with token
logUserIn = async (req, res, User, jwt, bcrypt, randomSecret) => {
    const { email, password } = req.body;
    try {
        const user = await getUser(email, User);
        await comparePassword(password, user.password, bcrypt);
        const randomToken = generateToken(jwt, user._id, randomSecret);
        res.status(200).json({userId: user._id, token: randomToken});
    } catch(error) {
        console.error(error);
        res.status(401).json({error});
    }
}

module.exports = ({logUserIn, registerUser});
