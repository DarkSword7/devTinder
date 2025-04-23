const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import the User model

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Validate the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // Find the user in the database
    const userId = decoded._id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Attach the user to the request object for further use in the route handlers
    req.user = user;
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Error in userAuth middleware:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = userAuth;
