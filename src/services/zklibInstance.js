const ZKLib = require('node-zklib');
const AttendanceModel = require('../models/attendence.model');
const moment = require('moment');

let lastSeenTimestamp = new Date(); // Initialize to current time to avoid processing old records

async function initializeZKLib() {
  const zkInstance = new ZKLib(process.env.ZKLIB_IP_ADDRESS, 4370, 5200, 5000);

  try {
    await zkInstance.createSocket();
    console.log('Connected to ZKTeco device');

    setInterval(async () => {
      try {
        const logs = await zkInstance.getAttendances();
        // const user = await zkInstance.getUsers()
        // console.log(user);
        if (logs && Array.isArray(logs.data)) {



          // Only process logs after the last seen timestamp
          const newLogs = logs.data.filter(
            log => new Date(log.recordTime) > lastSeenTimestamp
          );

          if (newLogs.length > 0) {
            // Update lastSeenTimestamp to the latest record time
            lastSeenTimestamp = new Date(
              Math.max(...newLogs.map(log => new Date(log.recordTime)))
            );

            for (const log of newLogs) {
              const recordTime = moment(log.recordTime);

              // Skip posting if time is between 1:30 PM and 3:00 PM
              if (
                recordTime.isBetween(
                  moment('13:30', 'HH:mm'),
                  moment('15:00', 'HH:mm')
                )
              ) {
                console.log('Skipping time between 1:30 PM and 3:00 PM');
                continue;
              }

              const existingRecord = await AttendanceModel.findOne({
                userId: log.deviceUserId,
                date: recordTime.format('YYYY-MM-DD'),
              });

              if (!existingRecord) {
                // Create a new record if none exists
                await AttendanceModel.create({
                  userId: log.deviceUserId,
                  inGoing: recordTime.isBefore(moment('13:30', 'HH:mm'))
                    ? log.recordTime
                    : null,
                  outGoing: recordTime.isAfter(moment('15:00', 'HH:mm'))
                    ? log.recordTime
                    : null,
                  OfficeWorking: "00",
                  date: recordTime.format("YYYY-MM-DD"),
                  note: ""
                });
              } else {
                // Update existing record
                if (
                  recordTime.isBefore(moment('13:30', 'HH:mm')) &&
                  !existingRecord.inGoing
                ) {
                  existingRecord.inGoing = log.recordTime;
                } else if (recordTime.isAfter(moment('15:00', 'HH:mm'))) {
                  existingRecord.outGoing = log.recordTime;
                }
                await existingRecord.save();
              }
            }
          }
        } else {
          console.error('Fetched logs data is not an array:', logs.data);
        }
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    }, 10000); // Poll every 10 seconds
  } catch (err) {
    console.error('Error connecting to ZKTeco device:', err);
  }
}

module.exports = initializeZKLib;
