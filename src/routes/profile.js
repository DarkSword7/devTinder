const express = require("express");
const router = express.Router();
const User = require("../models/user");
const userAuth = require("../middleware/auth");

// Profile API - GET /profile - Fetch user profile by ID
router.get("/profile", userAuth, async (req, res) => {
  const userId = req.user._id; // Extract user ID from the request object (set by userAuth middleware)

  try {
    // Find the user by ID and exclude the password field from the response
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user); // Return the user profile
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
