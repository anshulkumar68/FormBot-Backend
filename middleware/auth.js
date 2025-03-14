const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;  // check for auth token
    if (!token) {
        return res.status(401).json({ message: "This action is not allowed" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Assuming payload contains the user info like { id: user._id }
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
module.exports = authMiddleware;