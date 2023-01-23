// Utility functions 
const fs = require("fs").promises;

/**
 * 
 * @param { String } email 
 * @param { String } hashedPassword 
 * @param { Object - Database } User 
 */
const saveUserInDb = async (email, hashedPassword, User) => {
    try {
        const user = new User({
            email:email,
            password: hashedPassword
        });
        await user.save();
    } catch(error) {
        console.error(error);
    }
}

/**
 * 
 * @param { String } password 
 * @param { Number } saltRounds 
 * @returns { Promise } of String
 */
const getHashedPassword = async (password, saltRounds, bcrypt) => {
    try {
        const generatedSalt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, generatedSalt);
    } catch(error) {
        console.error(error);
    } 
}

/**
 * 
 * @param {String} email 
 * @param {Object - Database} User 
 * @returns 
 */
const checkUser = async (email, User) => {
    try {
        const user = await User.findOne({email:email});
        return user;
    }catch(error) {
        console.error(error);
    }
}

/**
 * 
 * @param {String} password 
 * @param {String} hash 
 * @returns { Promise } of a Boolean
 */
const comparePassword = async (password, hash, bcrypt) => {
    try {
        return await bcrypt.compare(password, hash);
    }catch(error) {
        console.log(error);
        res.status(404).json(error);
    }
    return false;
}

/**
 * Generate a token containing userId
 * @param {Object} jwt 
 * @param {String} userId 
 * @returns 
 */
const generateToken = (jwt, userId, randomSecret) => {
    return jwt.sign(
        { userId: userId },
        randomSecret,
        { expiresIn: "24h" }
    );
}

/**
 * Normalize val
 * @param {String} val 
 * @returns {String | Number | boolean}
 */
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

  // Handle error in server
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
      default:
        throw error;
    }
  };

/**
 * Update the right likes or dislikes value and modify the usersLiked or usersDisliked array accordingly
 * @param {Object} Sauce 
 * @param {String} id 
 * @param {String} userId 
 * @param {Number} like 
 * @returns 
 */
const updateLikes = async (Sauce, id, userId, like) => {
    const sauce = await Sauce.findById(id);
    let field;
    let action;
    let message = "vote registered with success";
    let value;
    switch (like) {
        case 1:
            field = "usersLiked",
            action = "$push";
            value = "likes";
            break;
        case -1:
            field = "usersDisliked";
            action = "$push";
            value = "dislikes";
            like = 1;
            break;
        case 0:
            action = "$pull";
            like = -1;
            field = sauce.usersLiked.includes(userId) ? "usersLiked" : "usersDisliked";
            value = sauce.usersLiked.includes(userId) ? "likes" : "dislikes";
            message = "vote modified with success";
            break;
        default: 
            throw new Error("Wrong like value, expected 1, 0 or -1");
    }
    await Sauce.updateOne(
        {"_id": id},
        {
            [action]: {[field]: userId},
            $inc: {[value]: like}
        }
    );
    return message;
}

/**
 * Remove the image from the path
 * @param {String} path - local path where to remove the image
 * @param {String} imageUrl - image url from the database
 */
const removeImageFromPath = async (path, imageUrl) => {
    // Retrieve the filename of the image
    const filename = imageUrl.split(`/${path}/`)[1];
    await fs.unlink(`${path}/${filename}`); // Remove the image
}

module.exports = ({
    checkUser, 
    comparePassword, 
    errorHandler,
    generateToken,
    getHashedPassword, 
    normalizePort,
    removeImageFromPath,
    saveUserInDb,
    updateLikes
});


