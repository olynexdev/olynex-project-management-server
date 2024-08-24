const AttendanceModel = require('../../models/attendence.model');

exports.getAllAttendances = async (req, res) => {
  const searchQuery = req.query.search;

  try {
    let attendances;

    if (searchQuery) {
      // Search using regex for partial match on deviceUserId
      attendances = await AttendanceModel.find({
        $or: [
          { deviceUserId: { $regex: searchQuery, $options: 'i' } }, // Match partial value using regex
          { deviceUserId: { $eq: parseInt(searchQuery, 10) } }, // Exact match if the full number is provided
        ],
      });
    } else {
      // If no search query, return all attendances
      attendances = await AttendanceModel.find();
    }

    res.json(attendances);
  } catch (err) {
    console.error('Error fetching attendance data:', err);
    res.status(500).send('Internal Server Error');
  }
};
