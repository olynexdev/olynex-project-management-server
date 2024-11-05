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
// get Advance with userId
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
    res.status(500).json({ error: 'Failed to fetch Advance data' });
  }
};

exports.deleteAdvance = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ message: 'Invalid request: ID is required.' });
  }
  console.log(id);

  try {
    const result = await advancePaymentModel.findByIdAndDelete(id);

    if (!result) {
      // If no document is found, return a 404 response
      return res.status(404).json({ message: 'Advance record not found.' });
    }

    res
      .status(201)
      .json({ message: 'Advance record deleted successfully.', result });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete Advance record.',
      error: err.message,
    });
  }
};

exports.editAdvancePayment = async (req, res) => {
  const id = req.params.id;
  const paymentData = req.body;
  try {
    const result = await advancePaymentModel.updateOne(
      { _id: id },
      { $set: paymentData }
    );
    res.status(201).send(result);
  } catch (err) {
    console.log(err);
  }
};
