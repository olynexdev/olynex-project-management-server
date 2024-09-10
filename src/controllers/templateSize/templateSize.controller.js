const templateSizeModel = require('../../models/templateSize.model');

// post new template size data
exports.addTemplateSize = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    const result = await templateSizeModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Template size Insert Error!', error });
  }
};

// get all Template size data
exports.getTemplateSize = async (req, res) => {
  try {
    const result = await templateSizeModel.find();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: 'Template size get Error!', err });
  }
};

// Delete a specific Template size by ID
exports.deleteTemplateSize = async (req, res) => {
  const id = req.params.id;
  try {
    // Use Mongoose deleteOne to delete the Template size
    const result = await templateSizeModel.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res
        .status(200)
        .send({ message: 'Template size data deleted successfully' });
    } else {
      res.status(404).send({ message: 'Template size not found' });
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error deleting Template size', error: err });
  }
};

// Update a specific TemplateSize by ID
exports.updateTemplateSize = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const result = await templateSizeModel.updateOne({ _id: id }, updateData);
    res.status(200).send(result);
  } catch (err) {
    res
      .status(500)
      .send({ message: 'Error updating Template size', error: err });
  }
};
