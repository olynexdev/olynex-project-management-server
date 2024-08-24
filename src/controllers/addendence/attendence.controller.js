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
  const dateQuery = req.query.date; // my date format is 2024-08-24T05:41:31.659Z
  const id = parseInt(searchQuery, 10);
  console.log(dateQuery);

  try {
    let attendances;

    // Check if monthQuery is provided and valid
    let startDate = null;
    let endDate = null;
    console.log(startDate, endDate);

    if (monthQuery && monthMap[monthQuery] !== undefined) {
      const selectedMonth = monthMap[monthQuery];
      console.log(selectedMonth);
      const currentYear = new Date().getFullYear();

      startDate = new Date(currentYear, selectedMonth, 1);
      endDate = new Date(currentYear, selectedMonth + 1, 1);
      attendances = await AttendanceModel.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
      return res.json(attendances);
    }

    // Build the query
    const query = {};

    if (id) {
      query.userId = id;
    }

    if (dateQuery) {
      // Convert dateQuery to a date object
      const selectedDate = new Date(dateQuery);
      const startNewDate = new Date(selectedDate.setUTCHours(0, 0, 0, 0)); // Start of the selected day
      const endNewDate = new Date(selectedDate.setUTCHours(23, 59, 59, 999)); // End of the selected da
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
