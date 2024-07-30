const CategoryModel = require("../../models/category.model")


// post new category
exports.addCategory = async (req, res) => {
    const body = req.body; // req to frontend
    try {
        const result = await CategoryModel.create(body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "Category Insert Error!", error });
    }
};

// get all category data 
exports.getCategory = async(req, res) =>{
    try{
        const result = await CategoryModel.find();
        res.status(201).send(result)
    }catch(err){
        res.status(500).send({ message: "Category get Error!", err });
    }
}

// Delete a specific category by ID
exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id; 
    try {
        // Use Mongoose deleteOne to delete the category
        const result = await CategoryModel.deleteOne({ _id: categoryId });
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "Category deleted successfully" });
        } else {
            res.status(404).send({ message: "Category not found" });
        }
    } catch (err) {
        res.status(500).send({ message: "Error deleting Category", error: err });
    }
};

// Update a specific category by ID
exports.updateCategory = async (req, res) => {
    const categoryId = req.params.id;
    const updateData = req.body; 
    try {
        const result = await CategoryModel.updateOne({ _id: categoryId }, updateData);
         res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Error updating File Type", error: err });
    }
};