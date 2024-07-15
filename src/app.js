// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const departmentRoutes = require("./routes/department.routes.js");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Olynex management server running!");
});

//*All Routes
app.use("/api/v1/", departmentRoutes);

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");

app.use(errorHandler);

module.exports = app;
