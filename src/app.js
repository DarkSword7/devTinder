const express = require("express");

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const PORT = process.env.PORT || 3000;

let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Jim Doe" },
];

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Add a new user
app.post("/users", (req, res) => {
  const newUser = req.body;
  newUser.id = users.length + 1;
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user by ID
app.patch("/users/:id", (req, res) => {
  const userID = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((user) => user.id === userID);
  console.log(users[userIndex]);
  if (userIndex !== -1) {
    const updatedUser = { ...users[userIndex], ...req.body };
    console.log(updatedUser);
    users[userIndex] = updatedUser;
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const userID = parseInt(req.params.id, 10);
  console.log(userID);
  const userIndex = users.findIndex((user) => user.id === userID);
  console.log(userIndex);
  if (userIndex !== -1) {
    const deleted = users.splice(userIndex, 1);
    console.log(deleted);
    res.status(200).json(deleted[0]);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
