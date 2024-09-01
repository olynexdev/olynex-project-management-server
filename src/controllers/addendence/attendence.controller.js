const AttendanceModel = require('../../models/attendence.model');
const UserModel = require('../../models/users.model');
const moment = require('moment');

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
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10; // Number of records per page
  const skip = (page - 1) * limit;

  const id = parseInt(searchQuery, 10);

  try {
    let query = {};

    // filter by month
    if (monthQuery && monthMap[monthQuery] !== undefined) {
      const selectedMonth = monthMap[monthQuery];
      const currentYear = new Date().getFullYear();

      const startDate = new Date(currentYear, selectedMonth, 1); // month start date
      const endDate = new Date(currentYear, selectedMonth + 1, 1); // month end date

      query.createdAt = { $gte: startDate, $lt: endDate };

      // Fetch the data from MongoDB with pagination for the month filter
      const attendances = await AttendanceModel.find(query)
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const totalRecords = await AttendanceModel.countDocuments(query);
      const totalPages = Math.ceil(totalRecords / limit);

      return res.json({
        attendances,
        currentPage: page,
        totalPages,
        totalRecords,
      });
    }

    // search query
    if (id) {
      query.userId = id;
    }

    // date query
    if (dateQuery && !id) {
      const selectedDate = new Date(dateQuery);
      if (isNaN(selectedDate)) {
        return res.status(400).send('Invalid date format.');
      }
      const startNewDate = new Date(selectedDate.setUTCHours(0, 0, 0, 0)); // Start of the selected day
      const endNewDate = new Date(selectedDate.setUTCHours(23, 59, 59, 999)); // End of the selected day
      query.createdAt = { $gte: startNewDate, $lt: endNewDate };
    }

    // Fetch the data from MongoDB with pagination for other filters
    const attendances = await AttendanceModel.find(query)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalRecords = await AttendanceModel.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      attendances,
      currentPage: page,
      totalPages,
      totalRecords,
    });
  } catch (err) {
    console.error('Error fetching attendance data:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAttendanceWithUserId = async (req, res) => {
  const { userId, startDate, endDate, month } = req.query;
  try {
    // Initialize the query object
    const query = {};

    // Add userId condition if present
    if (userId) {
      query.userId = userId;
    }

    // Add date condition based on the selected month
    if (month && month !== 'All') {
      const year = new Date().getFullYear(); // Get the current year
      const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
      // Calculate the last day of the month
      const endDate = new Date(year, parseInt(month), 0, 23, 59, 59, 999);
      // Query for records within the selected month
      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (startDate && endDate) {
      // If a date range is provided, use it to query records
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Fetch attendance data based on the constructed query
    const attendance = await AttendanceModel.find(query).sort({
      createdAt: -1,
    });

    res.json(attendance);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: 'Failed to fetch attendance data' });
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

// post attendance in in frontend
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

exports.postAbsentAttendance = async (req, res) => {
  try {
    const users = await UserModel.find(); // Fetch all users from the database
    const attendance = await AttendanceModel.find({
      date: moment().format('YYYY-MM-DD'), // Filter attendance for the current day
    });

    // Loop through each user
    for (const user of users) {
      const userAttendance = attendance.find(
        record => record.userId === user.userId
      );

      // Check if the user has no attendance record for the day or if outGoing is missing
      if (!userAttendance || !userAttendance.outGoing) {
        const currentTime = moment();

        // If current time is after 6 PM and no record exists, mark the user as absent
        if (
          currentTime.isAfter(moment().set({ hour: 15, minute: 0, second: 0 }))
        ) {
          const newAttendance = new AttendanceModel({
            userId: user.userId,
            date: moment().format('YYYY-MM-DD'),
            inGoing: null,
            outGoing: null,
            OfficeWorking: '0',
            note: '',
          });
          await newAttendance.save(); // Save the absent record to the database
          console.log(`Marked user ${user.userId} as absent`);
        }
      }
    }

    res.status(200).json({ message: 'Absent attendance posted successfully' });
  } catch (error) {
    console.error('Error posting absent attendance:', error);
    res.status(500).json({ message: 'Error posting absent attendance' });
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

// get all attendance related count
exports.attendanceCounts = async (req, res) => {
  try {
    const month = req.params.month;
    const currentYear = new Date().getFullYear();

    let attendanceData;

    if (month === 'All') {
      // Aggregate attendance data for all dates
      attendanceData = await AttendanceModel.aggregate([
        {
          $match: {
            createdAt: { $type: 'date' }, // Ensure `createdAt` is of type date
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            attendedDays: {
              $sum: {
                $cond: [{ $gt: ['$OfficeWorking', '0'] }, 1, 0],
              },
            },
            absentDays: {
              $sum: {
                $cond: [{ $eq: ['$OfficeWorking', '0'] }, 1, 0],
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalDays: { $sum: 1 },
            totalAttendedDays: { $sum: '$attendedDays' },
            totalAbsentDays: { $sum: '$absentDays' },
          },
        },
      ]);
    } else {
      // Calculate the start and end dates for the specified month
      const startDate = new Date(`${currentYear}-${month}-01T00:00:00.000Z`);
      const endDate = new Date(
        currentYear,
        parseInt(month),
        0,
        23,
        59,
        59,
        999
      );

      // Aggregate attendance data for the specified month
      attendanceData = await AttendanceModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            attendedDays: {
              $sum: {
                $cond: [{ $gt: ['$OfficeWorking', '0'] }, 1, 0],
              },
            },
            absentDays: {
              $sum: {
                $cond: [{ $eq: ['$OfficeWorking', '0'] }, 1, 0],
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            totalDays: { $sum: 1 },
            totalAttendedDays: { $sum: '$attendedDays' },
            totalAbsentDays: { $sum: '$absentDays' },
          },
        },
      ]);
    }

    // Extract the results
    const result = attendanceData[0] || {
      totalDays: 0,
      totalAttendedDays: 0,
      totalAbsentDays: 0,
    };

    console.log('Aggregated Data:', result);
    res.status(200).json(result);
  } catch (error) {
    // Handle any errors that occurred
    res.status(500).json({ message: 'Error retrieving user counts', error });
  }
};
