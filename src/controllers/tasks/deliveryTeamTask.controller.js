const TaskModel = require("../../models/tasks.model");

// seo accept in this task and ready for upload it.
exports.deliveryTeamUploadTask = async (req, res) => {
    try {
      const { id } = req.params; // Assuming taskId is passed in URL params
      const {
        uploadInfoUpdate,
        deliveryStatus,
        deliveryComment
      } = req.body;
  
      // Find the task by taskId
      const task = await TaskModel.findById(id);
  
      if (!task) {
        return res.status(404).send({ message: "Task not found" });
      }
  
       // Replace uploadInfoUpdate with new data
       if (uploadInfoUpdate) {
        task.uploadInfo = uploadInfoUpdate;
    }

      // Update delivery chain
      if (deliveryStatus) {
        task.approvalChain.forEach((entry) => {
          if (entry.designation === "delivery") {
            entry.comment = deliveryComment;
            entry.status = deliveryStatus;
          }
        });
      }
  
      // Save the updated task
      await task.save();
      res.status(200).send({ message: "Task uploaded success!", task });
    } catch (err) {
      res
        .status(500)
        .send({ message: "Failed to submit task", error: err.message });
    }
  };