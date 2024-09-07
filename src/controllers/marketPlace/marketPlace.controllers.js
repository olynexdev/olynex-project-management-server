const MarketPlaceModel = require('../../models/marketPlace.model');

exports.addMarketPlace = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    const result = await MarketPlaceModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'MarketPlace Insert Error!', error });
  }
};

exports.getAllMarketPlace = async (req, res) => {
  try {
    const result = await MarketPlaceModel.find();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'MarketPlace Insert Error!', error });
  }
};

exports.deleteMarketPlace = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await MarketPlaceModel.deleteOne({ _id: id });
    res.status(200).send(result);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error deleting Market Place', error: err });
  }
};
exports.updateMarketPlace = async (req, res) => {
  const { id } = req.params;
  const updateDoc = req.body;
  try {
    const result = await MarketPlaceModel.updateOne(
      { _id: id },
      { $set: updateDoc }
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Error Edit Market Place', error: err });
  }
};
