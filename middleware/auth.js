// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.replace("Bearer ", ""); // ✅ Strip 'Bearer '

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};
