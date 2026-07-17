const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userExtractor = async (request, response, next) => {
    const token = request.cookies?.accessToken;
    try {
        if (!token) {
        return response.status(401).json({ error: "token missing" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    request.user = user;
    } 
    catch (error) {
        return response.status(403);
    }
    next();
};

module.exports = { userExtractor };