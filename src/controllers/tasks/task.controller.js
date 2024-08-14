const TasksModel = require('../../models/tasks.model');

exports.addTask = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    // Create the new task
    const result = await TasksModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Task Adding Error!', error });
  }
};

// get all tasks with pagination
exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Get the total count of tasks
    const totalTasks = await TasksModel.countDocuments();

    // Find tasks with pagination
    const tasks = await TasksModel.find()
      .skip(skip)  
      .limit(parseInt(limit)); 

    // Calculate total pages
    const totalPages = Math.ceil(totalTasks / limit);

    // Send the paginated tasks with total pages
    res.status(200).send({
      tasks,
      totalPages
    });
  } catch (err) {
    res.status(500).send({ message: "Failed to retrieve tasks", err });
  }
};

exports.getTask = async (req, res) => {
  const { id } = req.params; // Extract the task ID from request parameters

  try {
    // Find a task by its ID
    const task = await TasksModel.findById(id);

    if (!task) {
      // Return 404 if task is not found
      return res.status(404).json({ message: "Task not found" });
    }

    // Return the found task
    res.status(200).json(task);
  } catch (error) {
    // Handle any errors that occurred
    res.status(500).json({ message: "Error retrieving task", error });
  }
};