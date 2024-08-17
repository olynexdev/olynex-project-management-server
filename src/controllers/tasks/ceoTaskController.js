const TaskModel = require("../../models/tasks.model");

exports.ceoAcceptTask = async (req, res) => {
  try {
    const { id } = req.params; // Assuming taskId is passed in URL params
    const { 
      approvalChainUpdate, 
      employeeComment, 
      ceoComment, 
      employeeStatus, 
      ceoStatus, 
      status 
    } = req.body;

    // Find the task by taskId
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
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
        if (entry.designation === 'employee') {
          entry.comment = employeeComment;
          entry.status = employeeStatus;
        }
      });
    }

    // Update CEO comment
    if (ceoComment) {
      task.approvalChain.forEach((entry) => {
        if (entry.designation === 'ceo') {
          entry.comment = ceoComment;
          entry.status = ceoStatus;
        }
      });
    }

    // Save the updated task
    await task.save();

    res.status(200).send({ message: 'Task accept success!', task });
  } catch (err) {
    res.status(500).send({ message: 'Failed to submit task', error: err.message });
  }
};



// ceo reject task
exports.ceoRejectTask = async(req, res)=>{
  try {
      const { id } = req.params; // Assuming taskId is passed in URL params
      const { rejectInfoUpdate, employeeComment, ceoComment, employeeStatus, ceoStatus, status } = req.body;
  
      // Find the task by taskId
      const task = await TaskModel.findById(id);
  
      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }
  
      // Update approvalChain
      if (rejectInfoUpdate) {
        task.rejectInfo.push(rejectInfoUpdate);
      }

      if(status){
        task.status = status
      }
  
      // Update employee comment
      if (employeeComment) {
        task.approvalChain.forEach((entry) => {
          if (entry.designation === 'employee') {
            entry.comment = employeeComment;
            entry.status = employeeStatus;
          }
        });
      }
      // Update ceo comment
      if (ceoComment) {
        task.approvalChain.forEach((entry) => {
          if (entry.designation === 'ceo') {
            entry.comment = ceoComment;
            entry.status = ceoStatus
          }
        });
      }

      // Save the updated task
      await task.save();
  
      res.status(200).send({ message: 'Task accept success!', task });
    } catch (err) {
      res.status(500).send({ message: 'Failed to submit task', err });
    }
}