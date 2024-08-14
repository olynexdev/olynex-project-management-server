const TaskModel = require("../../models/tasks.model");

exports.employeeAcceptTask = async (req, res) => {
  const { id } = req.params;
  const { status, approvalChain } = req.body;

  try {
    // Find the task and update the status, approvalChain, and taskTimer
    const updatedTask = await TaskModel.updateOne(
      { _id: id }, // Match the task by id
      {
        $set: {
          status: status,
          approvalChain: approvalChain,
          taskTimer: new Date(), // Update the taskTimer to the current date and time
        },
      }
    );

    // Check if any task was modified
    if (updatedTask.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or already has this status" });
    }

    // Return a success response
    res
      .status(200)
      .json({ message: "Task and approvalChain updated successfully" });
  } catch (error) {
    // Return an error response in case of an exception
    res.status(500).json({ message: "Error updating task", error });
  }
};
