const ZKLib = require('node-zklib');
const cron = require('node-cron');
const AttendanceModel = require('../models/attendence.model');
const moment = require('moment');
const UserModel = require('../models/users.model');

let zkInstance;
let lastSeenTimestamp = new Date(); // Track the last log seen

// Connect to ZKTeco device
async function connectToZKLib() {
  zkInstance = new ZKLib(process.env.ZKLIB_IP_ADDRESS, 4370, 5200, 5000);
  try {
    await zkInstance.createSocket();
    console.log('Connected to ZKTeco device...');
    return true;
  } catch (err) {
    console.error(
      'Error connecting to ZKTeco device:',
      err.message,
      `[IP - ${err?.ip}]`
    );
    return false;
  }
}

async function processAttendanceLog(log, isCronJob = false) {
  const recordTime = moment(log.recordTime);

  // Skip logs between 1:00 PM and 2:00 PM
  if (
    recordTime.isBetween(moment('13:00', 'HH:mm'), moment('14:15', 'HH:mm'))
  ) {
    console.log('Skipping logs between 1:00 PM and 2:00 PM');
    return;
  }

  if (!log.deviceUserId) {
    console.warn('Invalid log entry - deviceUserId missing.');
    return;
  }

  // Find user by deviceUserId
  const user = await UserModel.findOne({ userId: log.deviceUserId });
  if (!user) {
    console.log('User not found for deviceUserId:', log.deviceUserId);
    return;
  }

  // Find existing attendance record for the day
  const existingRecord = await AttendanceModel.findOne({
    userId: log.deviceUserId,
    date: recordTime.format('YYYY-MM-DD'),
  });

  if (existingRecord) {
    // Do not update inGoing if it already exists (only update if empty and before 2:00 PM)
    if (
      !existingRecord.inGoing &&
      recordTime.isBefore(moment('14:15', 'HH:mm'))
    ) {
      existingRecord.inGoing = log.recordTime; // Set inGoing
      await existingRecord.save();
      console.log(
        `Set inGoing for user: ${log.deviceUserId} at ${log.recordTime}`
      );
    }

    // Update outGoing with the latest record time after 2:00 PM
    if (recordTime.isAfter(moment('14:15', 'HH:mm'))) {
      existingRecord.outGoing = log.recordTime; // Update outGoing
      await existingRecord.save();
      console.log(
        `Updated outGoing for user: ${log.deviceUserId} at ${log.recordTime}`
      );
    }
  } else if (recordTime.isBefore(moment('14:15', 'HH:mm'))) {
    // If no record exists and the log is before 2:00 PM, create a new record
    const newRecord = new AttendanceModel({
      userId: log.deviceUserId,
      inGoing: log.recordTime, // Set inGoing
      outGoing: null, // outGoing will be updated later after 2:00 PM
      OfficeWorking: '00',
      date: recordTime.format('YYYY-MM-DD'),
      note: 'Present in this user, (Created by ZkTeco finger device)',
      casual: false,
      overTime: 0,
    });
    await newRecord.save();
    console.log(`Inserted new inGoing record for user: ${log.deviceUserId}`);
  } else if (isCronJob && recordTime.isAfter(moment('14:15', 'HH:mm'))) {
    // In case of a cron job after 2:00 PM, if the log is after 2:00 PM, update outGoing if no existing record
    const newRecord = new AttendanceModel({
      userId: log.deviceUserId,
      inGoing: null, // No inGoing as it's after 2:00 PM
      outGoing: log.recordTime, // Set outGoing
      OfficeWorking: '00',
      date: recordTime.format('YYYY-MM-DD'),
      note: 'Auto-created outgoing by cron job',
      casual: false,
      overTime: 0,
    });
    await newRecord.save();
    console.log(
      `Cron Job: Inserted new outGoing record for user: ${log.deviceUserId}`
    );
  }
}

// Fetch attendance logs and process them
async function fetchAttendanceLogs() {
  try {
    const logs = await zkInstance.getAttendances();

    if (logs && Array.isArray(logs.data)) {
      const newLogs = logs.data.filter(
        log => new Date(log.recordTime) > lastSeenTimestamp
      );

      if (newLogs.length > 0) {
        const latestRecordTime = new Date(
          Math.max(...newLogs.map(log => new Date(log.recordTime)))
        );
        lastSeenTimestamp = latestRecordTime;

        // Process logs immediately instead of batching
        for (const log of newLogs) {
          await processAttendanceLog(log); // Immediate processing of each log
        }
      }
    } else {
      console.error('Invalid logs data:', logs.data);
    }
  } catch (err) {
    console.error('Error fetching attendance logs:', err.message);
    connectToZKLib(); // Reconnect if an error occurs
  }
}

// Cron job logic to check missing users and post logs
async function checkMissingUsers() {
  const today = moment().format('YYYY-MM-DD');

  // Get all user logs from the device today
  const logs = await zkInstance.getAttendances();
  const todayLogs = logs.data.filter(
    log => moment(log.recordTime).format('YYYY-MM-DD') === today
  );

  // Find already posted records in DB for today
  const postedUserIds = (await AttendanceModel.find({ date: today })).map(
    att => att.userId
  );

  // Find logs for users that are not yet posted in DB today
  const missingLogs = todayLogs.filter(
    log => !postedUserIds.includes(log.deviceUserId)
  );
  console.log(missingLogs);

  // Insert missing users into DB based on log record time (with conditions)
  for (const log of missingLogs) {
    const recordTime = moment(log.recordTime);

    if (recordTime.isBefore(moment('13:00', 'HH:mm'))) {
      // Post inGoing if log time is before 1:00 PM
      await processAttendanceLog(log, true);
    } else if (recordTime.isAfter(moment('11.02', 'HH:mm'))) {
      // Post outGoing if log time is after 2:00 PM
      await processAttendanceLog(log, true);
    }
  }

  console.log(`Checked and posted missing users for ${today}`);
}

// Cron job to run every hour to check missing users
cron.schedule('0 * * * *', async () => {
  console.log('Running hourly cron job to check for missing attendance...');

  // Ensure connection to ZKTeco device
  const connected = await connectToZKLib();
  if (connected) {
    await checkMissingUsers(); // Check missing users and post them
  } else {
    console.error('Failed to connect to ZKTeco device for cron job.');
  }
});

// Initialize and start ZKLib device connection
async function initializeZKLib() {
  const maxRetries = 10;
  let connected = await connectToZKLib();
  let retries = 0;

  if (!connected) {
    console.log('Retrying ZKLib connection...');
  }

  while (!connected && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Retry every 10 seconds
    connected = await connectToZKLib();
    retries++;
    console.log(`Retry attempt: ${retries}`);
  }

  if (connected) {
    console.log('ZKLib connected. Starting real-time log fetching...');

    setInterval(async () => {
      try {
        await fetchAttendanceLogs(); // Fetch and process logs
      } catch (err) {
        console.error('Error processing logs:', err);
      }
    }, 5000); // Poll every 5 seconds for new logs
  } else {
    console.error('Failed to connect after maximum retries.');
  }
}

module.exports = initializeZKLib;
