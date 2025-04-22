const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config(); // Load environment variables from .env file
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the DevTinder API!"); // Simple welcome message
});

// Signup API - POST /signup - Create a new user
app.post("/signup", async (req, res) => {
  try {
    // Validate request body using the validation function
    validateSignUpData(req); // Validate the request body

    const { firstName, lastName, email, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" }); // Return error if user already exists
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
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body
  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return error if user not found
    }
    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" }); // Return error if password does not match
    }
    return res.status(200).json({ message: "Login successful" }); // Return success message
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Find User API - POST /user - Fetch user details by email
app.get("/user", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }); // Find the user by email
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user); // Return the user details
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Feed API - GET /feed - Fetch all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users from the database
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users); // Return the list of users
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete User API - DELETE /user - Delete a user by ID
app.delete("/user", async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findByIdAndDelete(id); // Find and delete the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" }); // Return success message
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Update User API - PATCH /user - Update user details by ID
app.patch("/user/:id", async (req, res) => {
  const id = req.params?.id; // Extract user ID from request body
  const data = req.body;

  try {
    const allowedFields = ["age", "photoUrl", "bio", "skills"];
    // Filter out fields that are not allowed to be updated
    const filteredData = Object.keys(data).every((key) =>
      allowedFields.includes(key)
    );

    if (!filteredData) {
      throw new Error("Invalid fields in request body"); // Throw error if invalid fields are found
    }

    if (data?.skills.length > 5) {
      throw new Error("Skills array should not exceed 5 items"); // Throw error if skills array exceeds 5 items
    }

    const user = await User.findByIdAndUpdate({ _id: id }, data, {
      runValidators: true,
    }); // Find and update the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully" }); // Return success message
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: error.message });
  }
});

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(PORT, () => {
      connectDB();
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process with failure
  });
