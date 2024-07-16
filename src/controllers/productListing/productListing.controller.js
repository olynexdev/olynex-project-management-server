const ProductListingModel = require("../../models/productListing.model");

// post new product
exports.addProduct = async (req, res) => {
    const body = req.body; // req to frontend
    try {
        const result = await ProductListingModel.create(body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: "Product Add Error!", error });
    }
};

// get all products data 
exports.getProducts = async(req, res) =>{
    try{
        const result = await ProductListingModel.find();
        res.status(201).send(result)
    }catch(err){
        res.status(500).send({ message: "Product get Error!", err });
    }
}