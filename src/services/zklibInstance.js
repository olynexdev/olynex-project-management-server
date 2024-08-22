const ZKLib = require("node-zklib");
const AttendanceModel = require("../models/attendence.model");

let lastSeenTimestamp = new Date(); // Initialize to current time to avoid processing old records

async function initializeZKLib() {
  const zkInstance = new ZKLib(process.env.ZKLIB_IP_ADDRESS, 4370, 5200, 5000);

  try {
    await zkInstance.createSocket();
    console.log("Connected to ZKTeco device");

    setInterval(async () => {
      try {
        const logs = await zkInstance.getAttendances();

        if (logs && Array.isArray(logs.data)) {
          // Only process logs after the last seen timestamp
          const newLogs = logs.data.filter(
            (log) => new Date(log.recordTime) > lastSeenTimestamp
          );

          if (newLogs.length > 0) {
            // Update lastSeenTimestamp to the latest record time
            lastSeenTimestamp = new Date(
              Math.max(...newLogs.map((log) => new Date(log.recordTime)))
            );

            // Insert new logs into the database
            for (const log of newLogs) {
              try {
                // Check if the record already exists in the database
                const existingRecord = await AttendanceModel.findOne({
                  recordTime: log.recordTime,
                  userSn: log.userSn,
                });
                if (!existingRecord) {
                  await AttendanceModel.create(log);
                }
              } catch (err) {
                console.error("Error processing log:", err);
              }
            }
          }
        } else {
          console.error("Fetched logs data is not an array:", logs.data);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    }, 10000); // Poll every 10 seconds
  } catch (err) {
    console.error("Error connecting to ZKTeco device:", err);
  }
}

module.exports = initializeZKLib;
