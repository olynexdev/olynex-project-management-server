const TaskModel = require("../../models/tasks.model");


// seo accept in this task and ready for upload it.
exports.seoAcceptTask = async (req, res) => {
    try {
      const { id } = req.params; // Assuming taskId is passed in URL params
      const {
        approvalChainUpdate,
        seoStatus,
        seoComment
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

      // Update CEO comment
      if (seoComment) {
        task.approvalChain.forEach((entry) => {
          if (entry.designation === "seo") {
            entry.comment = seoComment;
            entry.status = seoStatus;
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