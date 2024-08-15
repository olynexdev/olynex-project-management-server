const TaskModel = require("../../models/tasks.model");

exports.ceoAcceptTask = async(req, res)=>{
    try {
        const { id } = req.params; // Assuming taskId is passed in URL params
        const { approvalChainUpdate, coordinatorComment, employeeComment, ceoComment, employeeStatus, ceoStatus } = req.body;
    
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
          task.approvalChain.forEach((entry) => {
            if (entry.designation === 'co_ordinator') {
              entry.comment = coordinatorComment;
            }
          });
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
        // Update employee comment
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
        res.status(500).send({ message: 'Failed to submit task', err });
      }
}