const DisclaimerModel = require('../../models/disclaimer.model');

// post new Disclaimer
exports.addDisclaimer = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    const result = await DisclaimerModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Disclaimer Insert Error!', error });
  }
};

// get all Disclaimer data
exports.getDisclaimer = async (req, res) => {
  try {
    const result = await DisclaimerModel.find();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Disclaimer get Error!', err });
  }
};

// Delete a specific Diclaimer by ID
exports.deleteDisclaimer = async (req, res) => {
  const id = req.params.id; // Get the designation ID from request params
  try {
    // Use Mongoose deleteOne to delete the designation
    const result = await DisclaimerModel.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: 'Disclaimer deleted successfully' });
    } else {
      res.status(404).send({ message: 'Disclaimer not found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error deleting Disclaimer', error: err });
  }
};

// Update a specific Disclaimer by ID
exports.updateDisclaimer = async (req, res) => {
  const DisclaimerId = req.params.id;
  const updateData = req.body;
  try {
    // Use Mongoose updateOne to update the Disclaimer
    const result = await DisclaimerModel.updateOne(
      { _id: DisclaimerId },
      updateData
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Error updating Disclaimer', error: err });
  }
};
