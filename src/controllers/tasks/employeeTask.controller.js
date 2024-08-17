const TaskModel = require("../../models/tasks.model");

/**
 * Controller to handle employee's acceptance of a task.
 * Updates the task's status, approvalChain, and taskTimer.
 */
exports.employeeAcceptTask = async (req, res) => {
  const { id } = req.params;
  const { status, approvalChain } = req.body;

  try {
    // Update the task with the provided status, approvalChain, and set the taskTimer to the current date and time
    const updatedTask = await TaskModel.updateOne(
      { _id: id },
      {
        $set: {
          status,
          approvalChain,
          taskTimer: new Date(), // Current date and time
        },
      }
    );

    // Check if any task was modified
    if (updatedTask.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Task not found or already has this status" });
    }

    // Respond with success
    return res
      .status(200)
      .json({ message: "Task and approvalChain updated successfully" });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({ message: "Error updating task", error });
  }
};

/**
 * Controller to handle employee's task submission.
 * Updates the task's approvalChain, coordinator comment, submitInfo, employee status, and CEO status.
 */
exports.employeeSubmitTask = async (req, res) => {
  try {
    const { id } = req.params; // Assuming taskId is passed in URL params
    const {
      approvalChainUpdate,
      coordinatorComment,
      submitInfo,
      employeeStatus,
      ceoStatus,
      projectManagerStatus,
      status
    } = req.body;

    // Find the task by taskId
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // Update approvalChain if necessary
    if (approvalChainUpdate) {
      const ceoEntryExists = task.approvalChain.some(
        (entry) => entry.designation === "ceo"
      );

      // Only push the new approvalChainUpdate if the CEO entry doesn't already exist
      if (!ceoEntryExists || approvalChainUpdate.designation !== "ceo") {
        task.approvalChain.push(approvalChainUpdate);
      }
    }

    if(status){
      task.status = status
    }

    // Update coordinator comment
    if (coordinatorComment) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "co_ordinator" && !entry.comment) {
          entry.comment = coordinatorComment;
        }
      });
    }

    // Update CEO status
    if (ceoStatus) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "ceo") {
          entry.status = ceoStatus;
        }
      });
    }
    // Update project manager status
    if (projectManagerStatus) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "project_manager") {
          entry.status = projectManagerStatus;
        }
      });
    }

    // Update employee status
    if (employeeStatus) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "employee") {
          entry.status = employeeStatus;
        }
      });
    }

    // Handle submitInfo for a specific designation (e.g., "ceo")
    if (submitInfo) {
      const existingSubmitInfo = task.submitInfo.find(
        (info) => info.designation === submitInfo.designation
      );

      if (existingSubmitInfo) {
        // Update the fileUrl and note if submitInfo for the designation already exists
        existingSubmitInfo.fileUrl = submitInfo.fileUrl;
        existingSubmitInfo.note = submitInfo.note;
      } else {
        // Otherwise, push the new submitInfo
        task.submitInfo.push(submitInfo);
      }
    }

    // Save the updated task
    await task.save();

    // Respond with success
    return res.status(200).send({ message: "Task updated successfully", task });
  } catch (err) {
    // Handle any errors
    return res
      .status(500)
      .send({ message: "Failed to update task", error: err.message });
  }
};
