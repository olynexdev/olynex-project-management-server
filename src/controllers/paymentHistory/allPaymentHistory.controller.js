const advancePaymentModel = require('../../models/advancePayment.model');
const paymentHIstoryModal = require('../../models/paymentHistory.model');

exports.getAllPaymentHistory = async (req, res) => {
  const { month, tabValue } = req.query;
  const currentYear = new Date().getFullYear();

  try {
    const startDate = new Date(`${currentYear}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(currentYear, parseInt(month), 0, 23, 59, 59, 999);

    // Common query to filter tasks by the specified month
    let monthQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
    };
    let result;

    if (tabValue === 'monthly') {
      result = await paymentHIstoryModal.find(monthQuery);
    }
    if (tabValue === 'advance') {
      result = await advancePaymentModel.find(monthQuery);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
};
