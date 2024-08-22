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