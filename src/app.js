const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users); // Return the list of users
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/users/signin", async (req, res) => {
  const { email, password, firstName, lastName, age, gender } = req.body;

  try {
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      age,
      gender,
    });
    await user.save(); // Save the user to the database
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
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
