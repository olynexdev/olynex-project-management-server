// src/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const departmentRoutes = require('./routes/department.routes.js');
const marketPlaceRoutes = require('./routes/marketPlace.routes.js');
const designationRoutes = require('./routes/designation.routes.js');
const fileTypeRoutes = require('./routes/fileType.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const productsRoutes = require('./routes/productListing.routes.js');
const userRoutes = require('./routes/user.routes.js');
const taskRoutes = require('./routes/task.routes.js');
const notificationRoutes = require('./routes/notification.routes');
const attendenceRoutes = require('./routes/attendence.routes.js');
const advancePaymentRoutes = require('./routes/advancePayment.routes.js');
const paymentHistoryRoutes = require('./routes/paymentHIstory.routes.js');
const leaveRequestRoutes = require('./routes/leaveRequest.routes.js');
const taskMarketPlaceRoutes = require('./routes/taskMarketPlace.routes.js');
const jwtRoutes = require('./routes/jwt.routes.js');
const colorSpaceRoutes = require("./routes/colorSpace.routes.js")
const templateSizeRoutes = require("./routes/templateSize.routes.js")

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:1592', 'http://localhost:5173', "https://olynex.online"],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Home route
app.get('/', (req, res) => {
  res.send('Olynex management server running!');
});

//*All Routes with CRUD
app.use('/api/v1/', departmentRoutes); // department routes
app.use('/api/v1/', designationRoutes); // designation routes
app.use('/api/v1/', fileTypeRoutes); // file type routes
app.use('/api/v1/', categoryRoutes); // ategory routes
app.use('/api/v1/', productsRoutes); // products routes
app.use('/api/v1/', userRoutes); // user all routers
app.use('/api/v1/', taskRoutes); // all task routes
app.use('/api/v1/', notificationRoutes); //all notification routes
app.use('/api/v1/', marketPlaceRoutes);
app.use('/api/v1', attendenceRoutes); // attendence routes
app.use('/api/v1', advancePaymentRoutes); // advance payment routes
app.use('/api/v1', paymentHistoryRoutes);
app.use('/api/v1', leaveRequestRoutes);
app.use('/api/v1', taskMarketPlaceRoutes);
app.use('/api/v1', jwtRoutes);
app.use("/api/v1", colorSpaceRoutes)
app.use("/api/v1", templateSizeRoutes)

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');

app.use(errorHandler);

module.exports = app;
