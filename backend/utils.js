// Utility funtions 

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
        console.log(error);
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
const generateToken = (jwt, userId) => {
    return jwt.sign(
        { userId: userId },
        "RANDOM_TOKEN_SECRET",
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

module.exports = ({
    saveUserInDb, 
    getHashedPassword, 
    comparePassword, 
    checkUser, 
    generateToken,
    normalizePort,
    errorHandler
});


