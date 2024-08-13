const TaskModel = require("../../models/tasks.model");

exports.employeeAcceptTask = async (req, res) => {
    const { id } = req.params; 
    const { status, approvalChain } = req.body;

    try {
        // Find the task and update the status and the entire approvalChain
        const updatedTask = await TaskModel.updateOne(
            { _id: id }, // Match the task by id
            {
                $set: { 
                    status: status, // Update the overall task status
                    approvalChain: approvalChain // Replace the entire approvalChain with the new one
                }
            }
        );

        // Check if any task was modified
        if (updatedTask.nModified === 0) {
            return res.status(404).json({ message: 'Task not found or already has this status' });
        }

        // Return a success response
        res.status(200).json({ message: 'Task and approvalChain updated successfully' });
    } catch (error) {
        // Return an error response in case of an exception
        res.status(500).json({ message: 'Error updating task', error });
    }
};
