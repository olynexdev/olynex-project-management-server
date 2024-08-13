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
    const tasks = await TasksModel.find().skip(skip).limit(parseInt(limit));
    // Calculate total pages
    const totalPages = Math.ceil(totalTasks / limit);
    // Send the paginated tasks with total pages
    res.status(200).send({
      tasks,
      totalPages,
    });
  } catch (err) {
    res.status(500).send({ message: 'Failed to retrieve tasks', err });
  }
};
