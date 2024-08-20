const TaskModel = require("../../models/tasks.model");

// accept the task in project manager
exports.projectManagerAcceptTask = async (req, res) => {
  try {
    const { id } = req.params; // Assuming taskId is passed in URL params
    const {
      approvalChainUpdate,
      employeeComment,
      ceoComment,
      employeeStatus,
      projectManagerStatus,
      status,
    } = req.body;

    // Find the task by taskId
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // Update approvalChain
    if (approvalChainUpdate) {
      if (Array.isArray(task.approvalChain)) {
        task.approvalChain.push(approvalChainUpdate);
      } else {
        task.approvalChain = [approvalChainUpdate];
      }
    }

    // Update status
    if (status) {
      task.status = status; // Fixed this line to update the status
    }

    // Update employee comment
    if (employeeComment) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "employee") {
          entry.comment = employeeComment;
          entry.status = employeeStatus;
        }
      });
    }

    // Update CEO comment
    if (ceoComment) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "ceo") {
          entry.comment = ceoComment;
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

    // Save the updated task
    await task.save();

    res.status(200).send({ message: "Task accept success!", task });
  } catch (err) {
    res
      .status(500)
      .send({ message: "Failed to submit task", error: err.message });
  }
};

// project manager reject task
exports.projectManagerRejected = async (req, res) => {
  try {
    const { id } = req.params; // Assuming taskId is passed in URL params
    const {
      rejectInfoUpdate,
      employeeComment,
      projectManagerComment,
      employeeStatus,
      projectManagerStatus,
      status,
    } = req.body;

    // Find the task by taskId
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    // update rejected info
    if (rejectInfoUpdate) {
      const existingRejectInfo = task.rejectInfo.find(
        (info) => info.designation === rejectInfoUpdate.designation
      );

      if (!existingRejectInfo) {
        task.rejectInfo.push(rejectInfoUpdate);
      }
    }

    // Update status
    if (status) {
      task.status = status;
    }

    // Update employee comment
    if (employeeComment) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "employee") {
          entry.comment = employeeComment;
          entry.status = employeeStatus;
        }
      });
    }
    // Update ceo comment
    if (projectManagerStatus) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === "project_manager") {
          entry.comment = projectManagerComment;
          entry.status = projectManagerStatus;
        }
      });
    }

    // Save the updated task
    await task.save();

    res.status(200).send({ message: "Task accept success!", task });
  } catch (err) {
    res.status(500).send({ message: "Failed to submit task", err });
  }
};
