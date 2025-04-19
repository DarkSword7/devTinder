const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const connectDB = require("./config/database");

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

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
