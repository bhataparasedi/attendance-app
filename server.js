// server.js
const express = require("express");
const path = require("path");
const jsonServer = require("json-server");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend from public folder
app.use(express.static(path.join(__dirname, "public")));

// JSON Server setup
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
app.use("/api", middlewares, router);

// Fallback to index page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index2.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
