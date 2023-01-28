const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
    try {
        // Get the token from the request
        const token = req.headers.authorization.split(" ")[1];

        // Validate the token and get userId value
        const decodedToken = jwt.verify(token, process.env.RANDOM_SECRET);
        const userId = decodedToken.userId;
        // Attach the userId to the req.auth object
        req.auth = {
            userId: userId
        };
        next();
    }catch(error) {
        res.status(401).json({ error });
    }
};

module.exports = auth;