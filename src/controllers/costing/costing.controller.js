const CostingModel = require('../../models/costing.model');

// post new Costing
exports.addCosting = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    const result = await CostingModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Costing Insert Error!', error });
  }
};

// get all Costing data
exports.getCosting = async (req, res) => {
  const month = req.query.month;
  const currentYear = req.query.year;
  try {
    const startDate = new Date(`${currentYear}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(currentYear, parseInt(month), 0, 23, 59, 59, 999);

    let monthQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const result = await CostingModel.find(monthQuery);
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Costing get Error!', err });
  }
};
