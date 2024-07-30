const  mongoose  = require("mongoose");

const fileTypeSchema = new mongoose.Schema({
    fileType: {
        type: String,
        required: true
    }
},
{ timestamps: true }
)

const FileTypeModel = mongoose.model("fileType", fileTypeSchema);
module.exports= FileTypeModel;