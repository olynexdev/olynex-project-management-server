const cron = require('node-cron');
const AddendenceModel = require('../models/attendence.model');
const UserModel = require('../models/users.model');
const moment = require('moment');

// Schedule a job to run at 5 PM every day except Fridays
const scheduleAttendanceCheck = () => {
  cron.schedule('0 16 * * 0-4,6-7', async () => {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Start of the day
      const tomorrow = new Date(today);
      tomorrow.setUTCHours(24, 0, 0, 0); // Start of the next day

      // Get all employees
      const employees = await UserModel.find({});

      for (const employee of employees) {
        // Check if the employee has an incoming record for today
        const attendance = await AddendenceModel.findOne({
          userId: employee.userId,
          createdAt: {
            $gte: today,
            $lt: tomorrow,
          },
          inGoing: { $exists: true }, // Assuming `inGoing` is the check-in field
        });

        if (!attendance) {
          // No attendance record found, mark the employee as absent
          await AddendenceModel.create({
            userId: employee.userId,
            date: moment().format('YYYY-MM-DD'),
            OfficeWorking: '0',
            inGoing: null,
            outGoing: null,
            overTime: 0,
            casual: false,
            note: 'Absent (Auto-generated)',
          });
          console.log(`Employee ${employee.userId} marked as absent.`);
        }
      }
    } catch (err) {
      console.error('Error running scheduled attendance job:', err);
    }
  });
};

module.exports = scheduleAttendanceCheck;
