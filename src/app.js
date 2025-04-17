const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/test", (req, res) => {
  res.send("Hello from test route!");
});
app.use((req, res) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
