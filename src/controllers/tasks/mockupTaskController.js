const TaskModel = require('../../models/tasks.model');

// approve the task in mockup
exports.mockupConfirmTask = async (req, res) => {
  try {
    const { id } = req.params; // Assuming taskId is passed in URL params
    const { mockupComment, ceoComment, mockupStatus, ceoStatus } = req.body;

    // Find the task by taskId
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }

    // Update Ceo comment & status
    if (ceoComment) {
      task.approvalChain.forEach(entry => {
        if (entry.designation === 'ceo') {
          entry.comment = ceoComment;
          entry.status = ceoStatus;
        }
      });
    }

    // Update Mockup comment & status
    if (mockupComment) {
      task.approvalChain.forEach(entry => {
        if (entry.designation === 'mockup') {
          entry.comment = mockupComment;
          entry.status = mockupStatus;
        }
      });
    }

    // Save the updated task
    await task.save();

    res.status(200).send({ message: 'Task approval success!', task });
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Failed to submit task', error: err.message });
  }
};
