const ZKLib = require('node-zklib');
const AttendanceModel = require('../models/attendence.model');
const moment = require('moment');
const UserModel = require('../models/users.model');

let lastSeenTimestamp = new Date();
let zkInstance;

// Connect to ZKTeco device
async function connectToZKLib() {
  zkInstance = new ZKLib(process.env.ZKLIB_IP_ADDRESS, 4370, 5200, 5000);
  try {
    await zkInstance.createSocket();
    console.log('Connected to ZKTeco device...');
    return true;
  } catch (err) {
    console.error('Error connecting to ZKTeco device:', err.message, `[IP - ${err?.ip}]`);
    return false;
  }
}

// Fetch attendance logs and process them in batches
async function fetchAttendanceLogs() {
  try {
    const logs = await zkInstance.getAttendances();

    if (logs && Array.isArray(logs.data)) {
      const newLogs = logs.data.filter(log => new Date(log.recordTime) > lastSeenTimestamp);

      if (newLogs.length > 0) {
        const latestRecordTime = new Date(Math.max(...newLogs.map(log => new Date(log.recordTime))));
        lastSeenTimestamp = latestRecordTime;

        // Process all logs in batches
        await processAttendanceLogsInBatch(newLogs);
      }
    } else {
      console.error('Invalid logs data:', logs.data);
    }
  } catch (err) {
    console.error('Error fetching attendance logs:', err.message);
    connectToZKLib()
  }
}

// Process logs in batches
async function processAttendanceLogsInBatch(logs) {
  const recordsToInsert = [];
  const updatePromises = [];

  for (const log of logs) {
    const recordTime = moment(log.recordTime);

    // Skip records between 1:30 PM and 2:45 PM
    if (recordTime.isBetween(moment('13:30', 'HH:mm'), moment('14:45', 'HH:mm'))) {
      console.log('Skipping time between 1:30 PM and 2:45 PM');
      continue;
    }

    if (!log.deviceUserId) {
      console.warn('Invalid log entry - deviceUserId missing.');
      continue;
    }

    // Find user and check for existing attendance
    const findUser = await UserModel.findOne({ userId: log.deviceUserId });
    if (!findUser) {
      console.log('User not found for deviceUserId:', log.deviceUserId);
      continue;
    }

    const existingRecord = await AttendanceModel.findOne({
      userId: log.deviceUserId,
      date: recordTime.format('YYYY-MM-DD'),
    });

    if (existingRecord) {
      // Update inGoing or outGoing based on time
      if (recordTime.isBefore(moment('13:00', 'HH:mm')) && !existingRecord.inGoing) {
        existingRecord.inGoing = log.recordTime;
      } else if (recordTime.isAfter(moment('14:10', 'HH:mm'))) {
        existingRecord.outGoing = log.recordTime;
      }
      updatePromises.push(existingRecord.save());
    } else {

      // Prepare new attendance record for batch insert
      recordsToInsert.push({
        userId: log.deviceUserId,
        inGoing: recordTime.isBefore(moment('13:00', 'HH:mm')) ? log.recordTime : null,
        outGoing: recordTime.isAfter(moment('14:10', 'HH:mm')) ? log.recordTime : null,
        OfficeWorking: "00",
        date: recordTime.format("YYYY-MM-DD"),
        note: "Present in this user, (Created by ZkTeco finger device)",
        casual: false,
        overTime: 0,
      });
    }
  }

  // Insert new records in bulk
  if (recordsToInsert.length > 0) {
    await AttendanceModel.insertMany(recordsToInsert);
    console.log(`Inserted ${recordsToInsert.length} new attendance records.`);
  }

  // Wait for all updates to finish
  if (updatePromises.length > 0) {
    await Promise.all(updatePromises);
    console.log(`Updated ${updatePromises.length} existing attendance records.`);
  }
}

// Initialize and handle retries
async function initializeZKLib() {
  const maxRetries = 10;
  let connected = await connectToZKLib();
  let retries = 0;

  if (!connected) {
    console.log('Retrying zklib connection...');
  }

  while (!connected && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Retry every 10 seconds
    connected = await connectToZKLib();
    retries++;
    console.log(`Retry attempt: ${retries}`);
  }

  if (connected) {
    let isPolling = false;

    setInterval(async () => {
      if (isPolling) return;
      isPolling = true;
      try {
        await fetchAttendanceLogs();
      } catch (err) {
        console.error('Error processing logs:', err);
      } finally {
        isPolling = false;
      }
    }, 10000); // Poll every 10 seconds
  } else {
    console.error('Failed to connect after maximum retries.');
  }
}

module.exports = initializeZKLib;
