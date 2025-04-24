const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const userAuth = require("../middleware/auth");

// Signup API - POST /signup - Create a new user
router.post("/signup", async (req, res) => {
  try {
    // Validate request body using the validation function
    validateSignUpData(req); // Validate the request body

    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" }); // Return error if user already exists
    }

    // Encrypt the password before saving to the database
    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user instance with the request body
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }); // Create a new user instance with the request body

    await user.save(); // Save the user to the database
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Login API - POST /login - Authenticate a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body
  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Return error if user not found
    }
    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await user.validatePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" }); // Return error if password does not match
    }
    // create a JWT token and set it in the cookie
    const token = await user.getJWT(); // Create a JWT token with user ID and secret key

    res.cookie("token", token, { httpOnly: true }); // Set the token in a cookie
    return res.status(200).json({ message: "Login successful" }); // Return success message
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Logout API - POST /logout - Logout a user
router.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token"); // Clear the token cookie
    return res.status(200).json({ message: "Logout successful" }); // Return success message
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
