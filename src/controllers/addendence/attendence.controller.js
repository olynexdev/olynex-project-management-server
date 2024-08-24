const AttendanceModel = require("../../models/attendence.model")

exports.getAllAttendances = async (req, res) => {
    try {
      const attendances = await AttendanceModel.find();
      res.json(attendances);
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      res.status(500).send('Internal Server Error');
    }
  };




  // delete all attendances
  exports.deleteAllAttendance = async(req, res)=>{
    try{
      const result = await AttendanceModel.deleteMany()
      res.status(201).send(result)
    }catch(err){
      res.status(500).send({message: "Failed to delete all attendance:", err})
    }
  }

  exports.postAttendance = async (req, res) => {
    const attendance = req.body;
  
    if (!attendance || Object.keys(attendance).length === 0) {
      return res.status(400).send({ message: "Attendance data is required!" });
    }
  
    try {
      const result = await AttendanceModel.create(attendance);
      res.status(201).send({ message: "Attendance posted successfully!", data: result });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Validation error", details: err.message });
      }
      res.status(500).send({ message: "Attendance post failed!", error: err.message });
    }
  };
  