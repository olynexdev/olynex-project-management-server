const advancePaymentModel = require('../../models/advancePayment.model');

// post advance payment data
exports.postAdvancePayment = async (req, res) => {
  const paymentData = req.body;
  try {
    const result = await advancePaymentModel.create(paymentData);
    res.status(201).send(result);
  } catch (err) {
    console.log(err);
  }
};

// get advance payment data with user id and date range
// get attendance with userId
exports.getAdvancePayment = async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    const result = await advancePaymentModel.find({
      userId: userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
};
