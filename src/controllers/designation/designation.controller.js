const DesignationModel = require("../../models/designation.model");


// post new designation
exports.addDesignation = async (req, res) => {
    const body = req.body; // req to frontend
    try {
        const result = await DesignationModel.create(body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "Designation Insert Error!", error });
    }
};

// get all designation data 
exports.getDesignation = async(req, res) =>{
    try{
        const result = await DesignationModel.find();
        res.status(201).send(result)
    }catch(err){
        res.status(500).send({ message: "Designation get Error!", err });
    }
}

// Delete a specific designation by ID
exports.deleteDesignation = async (req, res) => {
    const designationId = req.params.id; // Get the designation ID from request params
    try {
        // Use Mongoose deleteOne to delete the designation
        const result = await DesignationModel.deleteOne({ _id: designationId });
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "Designation deleted successfully" });
        } else {
            res.status(404).send({ message: "Designation not found" });
        }
    } catch (err) {
        res.status(500).send({ message: "Error deleting designation", error: err });
    }
};

// Update a specific designation by ID
exports.updateDesignation = async (req, res) => {
    const designationId = req.params.id;
    const updateData = req.body; 
    try {
        // Use Mongoose updateOne to update the designation
        const result = await DesignationModel.updateOne({ _id: designationId }, updateData);
         res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Error updating designation", error: err });
    }
};