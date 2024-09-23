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

// Fetch attendance logs
async function fetchAttendanceLogs() {
  try {
    const logs = await zkInstance.getAttendances();

    if (logs && Array.isArray(logs.data)) {
      const newLogs = logs.data.filter(log => new Date(log.recordTime) > lastSeenTimestamp);

      if (newLogs.length > 0) {
        const latestRecordTime = new Date(Math.max(...newLogs.map(log => new Date(log.recordTime))));
        lastSeenTimestamp = latestRecordTime;

        for (const log of newLogs) {
          const recordTime = moment(log.recordTime);

          if (recordTime.isBetween(moment('13:30', 'HH:mm'), moment('14:45', 'HH:mm'))) {
            console.log('Skipping time between 1:30 PM and 2:45 PM');
            continue;
          }

          if (!log.deviceUserId) {
            console.warn('Invalid log entry - deviceUserId missing.');
            continue;
          }

          const existingRecord = await AttendanceModel.findOne({
            userId: log.deviceUserId,
            date: recordTime.format('YYYY-MM-DD'),
          });

          const findUser = await UserModel.findOne({ userId: log.deviceUserId });

          if (findUser) {
            if (!existingRecord) {
              await AttendanceModel.create({
                userId: log.deviceUserId,
                inGoing: recordTime.isBefore(moment('13:30', 'HH:mm')) ? log.recordTime : null,
                outGoing: recordTime.isAfter(moment('15:00', 'HH:mm')) ? log.recordTime : null,
                OfficeWorking: "00",
                date: recordTime.format("YYYY-MM-DD"),
                note: "Present in this user, (Created by ZkTeco finger device)",
                casual: false,
                overTime: 0,
              });
            } else {
              if (recordTime.isBefore(moment('13:30', 'HH:mm')) && !existingRecord.inGoing) {
                existingRecord.inGoing = log.recordTime;
              } else if (recordTime.isAfter(moment('15:00', 'HH:mm'))) {
                existingRecord.outGoing = log.recordTime;
              }
              await existingRecord.save();
            }
          } else {
            console.log('User not found for deviceUserId:', log.deviceUserId);
          }
        }
      }
    } else {
      console.error('Invalid logs data:', logs.data);
    }
  } catch (err) {
    console.error('Error fetching attendance logs:', err.message);
  }
}

// Initialize and handle retries
async function initializeZKLib() {
  const maxRetries = 10;
  let connected = await connectToZKLib();
  let retries = 0;

  if (!connected) {
    console.log('Retrying connection...');
  }

  while (!connected && retries < maxRetries) {
    await new Promise(resolve => setTimeout(resolve, 60000)); // Retry every 5 seconds
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
