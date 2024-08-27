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

exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId } = req.query;
    const skip = (page - 1) * limit;

    // Convert userId to number if provided
    const numericUserId = userId ? parseInt(userId, 10) : undefined;

    // Build the filter query
    const filter = numericUserId
      ? {
          $or: [
            { approvalChain: { $elemMatch: { userId: numericUserId } } },
            { 'taskReceiver.userId': numericUserId },
          ],
        }
      : {};

    // Get the total count of tasks based on the filter
    const totalTasks = await TasksModel.countDocuments(filter);

    // Find tasks with pagination and filtering
    const tasks = await TasksModel.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

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

// get running task
exports.getRunningTask = async (req, res) => {
  try {
    const { userId } = req.params;

    const task = await TasksModel.findOne({
      $or: [
        {
          'taskReceiver.userId': userId,
          status: { $in: ['progress', 'review'] },
        },
        // return data when math aprovalChain userid
        {
          approvalChain: {
            $elemMatch: {
              userId: userId,
              status: { $in: ['pending', 'rejected'] },
            },
          },
        },
      ],
    })
      .sort({ taskStartDate: -1 }) // Sort by taskStartDate in descending order
      .exec(); // Execute the query

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'No running task found for this employee',
      });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error fetching employee's running task:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getTask = async (req, res) => {
  const { id } = req.params; // Extract the task ID from request parameters
  try {
    // Find a task by its ID
    const task = await TasksModel.findById(id);

    if (!task) {
      // Return 404 if task is not found
      return res.status(404).json({ message: 'Task not found' });
    }

    // Return the found task
    res.status(200).json(task);
  } catch (error) {
    // Handle any errors that occurred
    res.status(500).json({ message: 'Error retrieving task', error });
  }
};
