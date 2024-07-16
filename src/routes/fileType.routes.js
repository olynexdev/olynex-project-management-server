const express = require("express");
const { addFileType, getFileType, deleteFileType, updateFileType } = require("../controllers/fileType/fileType.controller");

const router = express.Router()

router.post("/post-file-type", addFileType) // add new file type
router.get("/get-file-type", getFileType) //  get all file type
router.delete("/delete-file-type/:id", deleteFileType) // delete an file type
router.patch("/edit-file-type/:id", updateFileType) // edit an file type

module.exports = router;