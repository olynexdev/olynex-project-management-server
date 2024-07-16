const FileTypeModel = require("../../models/fileType.model");


// post new file type
exports.addFileType = async (req, res) => {
    const body = req.body; // req to frontend
    try {
        const result = await FileTypeModel.create(body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "File type Insert Error!", error });
    }
};

// get all file type data 
exports.getFileType = async(req, res) =>{
    try{
        const result = await FileTypeModel.find();
        res.status(201).send(result)
    }catch(err){
        res.status(500).send({ message: "FileType get Error!", err });
    }
}

// Delete a specific file type by ID
exports.deleteFileType = async (req, res) => {
    const fileTypeId = req.params.id; 
    try {
        // Use Mongoose deleteOne to delete the file type
        const result = await FileTypeModel.deleteOne({ _id: fileTypeId });
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "FileType deleted successfully" });
        } else {
            res.status(404).send({ message: "FileType not found" });
        }
    } catch (err) {
        res.status(500).send({ message: "Error deleting FileType", error: err });
    }
};

// Update a specific fileTYpe by ID
exports.updateFileType = async (req, res) => {
    const fileTypeId = req.params.id;
    const updateData = req.body; 
    try {
        const result = await FileTypeModel.updateOne({ _id: fileTypeId }, updateData);
         res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Error updating File Type", error: err });
    }
};