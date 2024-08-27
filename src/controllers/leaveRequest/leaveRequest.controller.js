const leaveRequestModal = require("../../models/leaveRequst.modal");

// post a new leave request
exports.postLeaveRequest = async (req, res) => {
  const body = req?.body;
  try {
    const result = await leaveRequestModal.create(body);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};


// get all leave request
exports.getLeaveRequests = async (req, res) => {
  try {
    const result = await leaveRequestModal.find();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
