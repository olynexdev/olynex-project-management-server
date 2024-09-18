const AttendanceModel = require('../../models/attendence.model');
const UserModel = require('../../models/users.model');

exports.todayAttendanceCount = async (req, res) => {
  const currentDate = new Date();

  // Get the start and end of the day
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // 00:00:00
  const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // 23:59:59

  try {
    // Get the count of today's present users (users who marked attendance today)
    const todayPresent = await AttendanceModel.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Get the total number of users
    const totalUsers = await UserModel.countDocuments();

    // Calculate the number of absent users
    const todayAbsent = totalUsers - todayPresent;

    // Send the response with both present and absent counts
    res.status(200).send({
      todayPresent: todayPresent,
      todayAbsent: todayAbsent,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving today's attendance count!",
      error: err,
    });
  }
};
