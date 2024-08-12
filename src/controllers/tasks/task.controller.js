const TasksModel = require('../../models/tasks.model');

exports.addTask = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    // Create the new task
    const result = await TasksModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Task Adding Error!', error });
  }
};

// get all tasks
exports.getTasks = async(req, res)=>{
  try{
    const result = await TasksModel.find();
    res.send(result)
  }catch(err){
    res.status(501).send({message: "Tasks get failed", err})
  }
}