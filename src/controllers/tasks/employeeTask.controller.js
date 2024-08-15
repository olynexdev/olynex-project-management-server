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



// employee submit task
exports.employeeSubmitTask = async (req, res) => {
  try {
    const { id } = req.params; // Assuming taskId is passed in URL params
    const { approvalChainUpdate, coordinatorComment, submitInfo, employeeStatus } = req.body;

    // Find the task by taskId
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }

    // Update approvalChain
    if (approvalChainUpdate) {
      task.approvalChain.push(approvalChainUpdate);
    }

    // Update coordinator comment
    if (coordinatorComment) {
      let coordinatorFound = false;
      task.approvalChain.forEach((entry) => {
        if (entry.designation === 'co_ordinator' && !coordinatorFound) {
          entry.comment = coordinatorComment;
          coordinatorFound = true; // Stop after the first match
        }
      });
    }

    // Update employee status
    if (employeeStatus) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === 'employee') {
          entry.status = employeeStatus;
        }
      });
    }

    // Update submitInfo
    if (submitInfo) {
      task.submitInfo.push(submitInfo);
    }

    // Save the updated task
    await task.save();

    res.status(200).send({ message: 'Task updated successfully', task });
  } catch (err) {
    res.status(500).send({ message: 'Failed to update task', error: err.message });
  }
};
