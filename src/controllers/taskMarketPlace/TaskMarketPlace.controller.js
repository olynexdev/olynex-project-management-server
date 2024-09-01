const TaskMarketPlaceModel = require("../../models/taskMarketPlace.model");

// post new market place task id wise
exports.addTaskMarketPlace = async (req, res) => {
  const body = req?.body;
  try {
    const result = await TaskMarketPlaceModel.create(body);
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ messgae: "marketPlace add error", err });
  }
};

// Get task marketplace by taskId
exports.getTaskMarketPlace = async (req, res) => {
    const { taskId } = req.query;
    try {
      // Find one document that matches the taskId
      const result = await TaskMarketPlaceModel.findOne({ taskId });
      if (!result) {
        return res.status(404).send({ message: "Task Market Place not found!" });
      }
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Task Market Place retrieval error!" });
    }
  };


  // update taskMarket place
  exports.UpdateTaskMarketPlace = async (req, res) => {
    const id = req.params.id;
    const marketPlaceData = req.body; 
  
    // Validate if ID and marketplace data are present
    if (!id) {
      return res.status(400).json({ message: 'ID is required.' });
    }
  
    if (!marketPlaceData || Object.keys(marketPlaceData).length === 0) {
      return res.status(400).json({ message: 'Marketplace data is required.' });
    }
  
    try {
      // Find and update the marketplace data by ID
      const updatedMarketPlace = await TaskMarketPlaceModel.findByIdAndUpdate(
        id,
        { $set: marketPlaceData },  // Update the fields with the provided data
        { new: true, runValidators: true }  // Options: return the updated document, run validation
      );
  
      // Check if the task marketplace was found and updated
      if (!updatedMarketPlace) {
        return res.status(404).json({ message: 'Marketplace not found.' });
      }
  
      // Successfully updated
      res.status(201).json({
        message: 'Marketplace updated successfully!',
        data: updatedMarketPlace,
      });
    } catch (error) {
      // Handle any errors that occur during the update
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the marketplace.', error: error.message });
    }
  };
