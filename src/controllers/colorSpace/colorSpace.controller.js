const colorSpaceModel = require('../../models/colorSpace.model');

// post new color space data
exports.addColorSpace = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    const result = await colorSpaceModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Color Space Insert Error!', error });
  }
};

// get all color space data
exports.getColorSpace = async (req, res) => {
  try {
    const result = await colorSpaceModel.find();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Color Space get Error!', err });
  }
};

// Delete a specific color space by ID
exports.deleteColorSpace = async (req, res) => {
  const id = req.params.id;
  try {
    // Use Mongoose deleteOne to delete the color space
    const result = await colorSpaceModel.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res
        .status(200)
        .send({ message: 'Color Space data deleted successfully' });
    } else {
      res.status(404).send({ message: 'Color Space not found' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error deleting Color Space', error: err });
  }
};

// Update a specific ColorSpace by ID
exports.updateColorSpace = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await colorSpaceModel.updateOne({ _id: id }, updateData);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Error updating Color Space', error: err });
  }
};
