const ProductListingModel = require("../../models/productListing.model");

// Assuming you have a ProductListingModel with a field 'productId'
const getNextProductId = async () => {
  const latestProduct = await ProductListingModel.findOne().sort({
    productId: -1,
  });
  if (latestProduct) {
    return latestProduct.productId + 1;
  } else {
    return 2000;
  }
};

exports.addProduct = async (req, res) => {
  const body = req.body; // req to frontend

  try {
    // Get the next product ID
    const nextProductId = await getNextProductId();

    // Assign the next product ID to the body
    body.productId = nextProductId;

    // Create the new product
    const result = await ProductListingModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Product Add Error!", error });
  }
};

// get all products data
exports.getProducts = async (req, res) => {
  try {
    const result = await ProductListingModel.find();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: "Products get Error!", err });
  }
};
// get single product data
exports.getProduct = async (req, res) => {
    const productId = req.params?.id;
  try {
    const result = await ProductListingModel.findOne({productId});
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ message: "Product get Error!", err });
  }
};

// Delete a specific product by ID
exports.deleteProduct = async (req, res) => {
  const fileTypeId = req.params.id;
  try {
    // Use Mongoose deleteOne to delete the product
    const result = await ProductListingModel.deleteOne({ _id: fileTypeId });
    if (result.deletedCount === 1) {
      res.status(200).send({ message: "Product deleted successfully" });
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).send({ message: "Error deleting Product", error: err });
  }
};

// Update a specific product by ID
exports.updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body; 
    try {
        const result = await ProductListingModel.updateOne({ _id: productId }, updateData);
         res.status(200).send(result);
    } catch (err) {
        res.status(500).send({ message: "Error updating product", error: err });
    }
};
