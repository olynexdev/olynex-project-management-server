const AttendanceModel = require('../../models/attendence.model');

// Map of month names to their numerical values
const monthMap = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

exports.getAllAttendances = async (req, res) => {
  const searchQuery = req.query.search;
  const monthQuery = req.query.month;
  const dateQuery = req.query.date; // date format is 2024-08-24T05:41:31.659Z
  const id = parseInt(searchQuery, 10);

  try {
    let attendances;

    let startDate = null;
    let endDate = null;

    // filter with month
    if (monthQuery && monthMap[monthQuery] !== undefined) {
      console.log('object sfgasdfhdafghfg');
      const selectedMonth = monthMap[monthQuery];
      const currentYear = new Date().getFullYear();

      startDate = new Date(currentYear, selectedMonth, 1); // month first date
      endDate = new Date(currentYear, selectedMonth + 1, 1); // month end date
      attendances = await AttendanceModel.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
      return res.json(attendances);
    }

    // query for for search or filter with date
    const query = {};

    // search query
    if (id) {
      query.userId = id;
    }

    // date query
    if (dateQuery) {
      // Convert dateQuery to a date object
      const selectedDate = new Date(dateQuery);
      if (isNaN(selectedDate)) {
        return res.status(400).send('Invalid date format.');
      }
      const startNewDate = new Date(selectedDate.setUTCHours(0, 0, 0, 0)); // Start of the selected day
      const endNewDate = new Date(selectedDate.setUTCHours(23, 59, 59, 999)); // End of the selected day
      query.createdAt = { $gte: startNewDate, $lt: endNewDate };
    }

    // Fetch the data from MongoDB
    attendances = await AttendanceModel.find(query);

    res.json(attendances);
  } catch (err) {
    console.error('Error fetching attendance data:', err);
    res.status(500).send('Internal Server Error');
  }
};

// delete all attendances
exports.deleteAllAttendance = async (req, res) => {
  try {
    const result = await AttendanceModel.deleteMany();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete all attendance:', err });
  }
};

exports.postAttendance = async (req, res) => {
  const attendance = req.body;

  if (!attendance || Object.keys(attendance).length === 0) {
    return res.status(400).send({ message: 'Attendance data is required!' });
  }

  try {
    const result = await AttendanceModel.create(attendance);
    res
      .status(201)
      .send({ message: 'Attendance posted successfully!', data: result });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res
        .status(400)
        .send({ message: 'Validation error', details: err.message });
    }
    res
      .status(500)
      .send({ message: 'Attendance post failed!', error: err.message });
  }
};

exports.updateAttendance = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await AttendanceModel.updateOne(
      { _id: id },
      { $set: { OfficeWorking: '8' } }
    );
    res.status(201).send(result);
  } catch (err) {
    console.log(err);
  }
};

exports.editAttendance = async (req, res) => {
  const id = req.params.id;
  const attendanceData = req.body;
  console.log(id);
  try {
    const result = await AttendanceModel.updateOne(
      { _id: id },
      { $set: attendanceData }
    );
    res.status(201).send(result);
  } catch (err) {
    console.log(err);
  }
};
