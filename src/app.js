// src/app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const departmentRoutes = require('./routes/department.routes.js');
const designationRoutes = require('./routes/designation.routes.js');
const fileTypeRoutes = require('./routes/fileType.routes.js');
const categoryRoutes = require('./routes/category.routes.js');
const productsRoutes = require('./routes/productListing.routes.js');
const userRoutes = require('./routes/user.routes.js');
const taskRoutes = require('./routes/task.routes.js');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(morgan('dev'));
app.use(express.json());

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

// Error handling middleware
const errorHandler = require('./middlewares/errorHandler');

app.use(errorHandler);

module.exports = app;
