// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler.js");
const notFoundHandler = require("./middlewares/notFound.js");

// Initialize the app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:1592",
      "http://localhost:5173",
      "https://olynex.online",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Route imports
const routes = {
  department: require("./routes/department.routes.js"),
  marketPlace: require("./routes/marketPlace.routes.js"),
  designation: require("./routes/designation.routes.js"),
  fileType: require("./routes/fileType.routes.js"),
  category: require("./routes/category.routes.js"),
  product: require("./routes/productListing.routes.js"),
  user: require("./routes/user.routes.js"),
  task: require("./routes/task.routes.js"),
  notification: require("./routes/notification.routes.js"),
  attendance: require("./routes/attendence.routes.js"),
  advancePayment: require("./routes/advancePayment.routes.js"),
  paymentHistory: require("./routes/paymentHIstory.routes.js"),
  leaveRequest: require("./routes/leaveRequest.routes.js"),
  taskMarketPlace: require("./routes/taskMarketPlace.routes.js"),
  jwt: require("./routes/jwt.routes.js"),
  colorSpace: require("./routes/colorSpace.routes.js"),
  templateSize: require("./routes/templateSize.routes.js"),
  disclaimer: require("./routes/disclaimer.routes.js"),
};

// Use routes - Modularized
app.use("/api/v1", routes.department);
app.use("/api/v1", routes.designation);
app.use("/api/v1", routes.fileType);
app.use("/api/v1", routes.category);
app.use("/api/v1", routes.product);
app.use("/api/v1", routes.user);
app.use("/api/v1", routes.task);
app.use("/api/v1", routes.notification);
app.use("/api/v1", routes.marketPlace);
app.use("/api/v1", routes.attendance);
app.use("/api/v1", routes.advancePayment);
app.use("/api/v1", routes.paymentHistory);
app.use("/api/v1", routes.leaveRequest);
app.use("/api/v1", routes.taskMarketPlace);
app.use("/api/v1", routes.jwt);
app.use("/api/v1", routes.colorSpace);
app.use("/api/v1", routes.templateSize);
app.use("/api/v1", routes.disclaimer);

// Home route
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Server | Olynex</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          h1 {
            color: #0075EE;
            font-size: 30px;
            font-weight: bold;
            text-align: center;
          }
          p {
            color: gray;
            font-size: 18px;
            text-align: center;
          }
            .heading-img{
            display:flex;
            justify-content: center;
            }
            .runner-img{
           
            height: 30px
            }
        </style>
      </head>
      <body>
        <div>
            <div class="heading-img"><img src='https://media.tenor.com/Fhg7SnBUCcEAAAAi/cat-dance.gif' alt='No Img'/></div>
          <h1>Olynex Management Server Running...! <img class='runner-img' src='https://i.imgur.com/Il19vKq.gif' /></h1>
          <p>Please check your website <a href='https://olynex.online/'>Click Here</a> </p>
        </div>
      </body>
    </html>
  `);
});

// 404 Handler
app.all("*", notFoundHandler);

// Error Handling Middleware (HTML Response)
app.use((err, req, res, next) => {
  const errorMessage = err.message || "Internal Server Error";
  const errorStatus = err.status || 500;

  res.status(errorStatus).send(`
    <html>
      <head>
        <title>Error | Olynex</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
          }
          .container {
            text-align: center;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #dc3545;
            font-size: 36px;
            margin-bottom: 10px;
          }
          p {
            color: #6c757d;
            font-size: 18px;
          }
          .error-details {
            margin-top: 20px;
          }
          .error-code {
            font-weight: bold;
            color: #007bff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Error: ${errorStatus}</h1>
          <p>Oops! Something went wrong.</p>
          <div class="error-details">
            <p class="error-code">Error Type: ${errorStatus}</p>
            <p class="error-message">${errorMessage}</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Global Error Handling Middleware (JSON Response)
app.use(errorHandler);

module.exports = app;
