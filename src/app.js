// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const departmentRoutes = require("./routes/department.routes.js");
const fileTypeRoutes = require("./routes/fileType.routes.js");
const categoryRoutes = require("./routes/category.routes.js");
const productsRoutes = require("./routes/productListing.routes.js")

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

//*All Routes with CRUD
app.use("/api/v1/", departmentRoutes); // department routes
app.use("/api/v1/", fileTypeRoutes); // file type routes
app.use("/api/v1/", categoryRoutes) // ategory routes
app.use("/api/v1/", productsRoutes) // products routes

// Error handling middleware
const errorHandler = require("./middlewares/errorHandler");

app.use(errorHandler);

module.exports = app;
