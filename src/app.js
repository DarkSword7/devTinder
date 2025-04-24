const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const userAuth = require("./middleware/auth");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the DevTinder API!"); // Simple welcome message
});

app.use("/auth", authRoutes);
app.use("/user", profileRoutes);

// Feed API - GET /feed - Fetch all the users from the database
app.get("/feed", userAuth, async (req, res) => {
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
app.delete("/user", userAuth, async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findByIdAndDelete(id); // Find and delete the user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Update User API - PATCH /user - Update user details by ID
app.patch("/user/:id", userAuth, async (req, res) => {
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
