const paymentHIstoryModal = require('../../models/paymentHistory.model');
const moment = require('moment');

// post payment history
exports.postPaymentHistory = async (req, res) => {
  const history = req.body;
  try {
    const result = await paymentHIstoryModal.create(history);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'payment post failed!', err });
  }
};

// get payment histroy with user id or all data
exports.getPaymentHistory = async (req, res) => {
  const { userId } = req.query;
  // current month start date
  const startDate = moment().startOf('month').format('YYYY-MM-DD');

  // current month end date
  const endDate = moment().endOf('month').format('YYYY-MM-DD');

  try {
    let payment;

    if (userId) {
      // If userId is provided, find the latest payment data for the user
      payment = await paymentHIstoryModal
        .findOne({
          userId: userId,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .sort({ date: -1 });
    } else {
      // If userId is not provided, find all payment data for the current month
      payment = await paymentHIstoryModal.find().sort({ date: -1 });
    }

    if (payment) {
      res.json(payment); // Return the payment data
    } else {
      res.json({ payment: null }); // Return null if no payment data is found
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment data' });
  }
};
