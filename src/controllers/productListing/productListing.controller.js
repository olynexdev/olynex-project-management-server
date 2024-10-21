const ProductListingModel = require('../../models/productListing.model');
const TaskModel = require('../../models/tasks.model');

// Assuming you have a ProductListingModel with a field 'productId'
const getNextProductId = async () => {
  // Get the product with the highest productId
  const latestProduct = await ProductListingModel.findOne().sort({
    productId: -1,
  });

  // Check if a product exists
  if (latestProduct) {
    // If the latest productId is less than 2325, return 2325; otherwise, return latestProduct.productId + 1
    return latestProduct.productId >= 2325 ? latestProduct.productId + 1 : 2325;
  } else {
    // If no products exist, return 2325 as the first productId
    return 2325;
  }
};

exports.addProduct = async (req, res) => {
  try {
    // Get the next product ID
    const nextProductId = await getNextProductId();

    // Create a new product with the provided body and assign the next product ID
    const newProduct = { ...req.body, productId: nextProductId };

    // Save the new product to the database
    const result = await ProductListingModel.create(newProduct);

    // Send the created product as a response
    res.status(201).send(result);
  } catch (error) {
    // Catch any errors and return a 500 status with the error message
    res.status(500).send({ message: "Product Add Error!", error });
  }
};

// get all products data with pagination and categories
exports.getProducts = async (req, res) => {
  try {
    const { page, category = "" } = req.query; //
    const limit = 10; // page limit
    const skip = (page - 1) * limit; // page skip

    const query = category ? { category } : {};

    if (page == 0) {
      const products = await ProductListingModel.find().sort({ createdAt: -1 });
      return res.status(201).send({ products, totalPages: 0 });
    }

    // count page
    const totalProducts = await ProductListingModel.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // find product with pagination query
    const products = await ProductListingModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(201).send({ products, totalPages });
  } catch (err) {
    res.status(500).send({ message: "Products get Error!", err });
  }
};

// get single product data
exports.getProduct = async (req, res) => {
  const productId = req.params?.id;
  try {
    const result = await ProductListingModel.findOne({ productId });
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
  const id = req.params.id;
  const updateData = req.body;
  const {
    keywords,
    template_size,
    number_of_pages,
    productId,
    category,
    template_category,
    department,
    title,
    color_space,
  } = updateData;
  try {
    const result = await ProductListingModel.updateOne({ _id: id }, updateData);
    if (keywords || template_size || number_of_pages) {
      const result = await TaskModel.updateOne(
        { taskId: productId },
        {
          keywords: keywords,
          pages: number_of_pages,
          size: template_size,
          category,
          categoryNumber: template_category,
          department,
          title,
          colorSpace: color_space,
        }
      );
      console.log(result);
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send({ message: "Error updating product", error: err });
  }
};

// get all product related counts
const getAllProductsCount = async () => {
  // Count all products in the database
  const totalProductsCount = await ProductListingModel.countDocuments();

  // Get the date 7 days ago from now
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Count products created in the last 7 days
  const newProductsCount = await ProductListingModel.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  // Count products by category
  const productsByCategory = await ProductListingModel.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalProductsCount,
    newProductsCount,
    productsByCategory,
  };
};

// get product related counts by year
exports.productsCount = async (req, res) => {
  try {
    const month = req.params.month;
    const currentYear = new Date().getFullYear();

    if (month === "All") {
      const allData = await getAllProductsCount();
      return res.status(201).json(allData);
    }

    // start and end dates for the specified or current year
    const startDate = new Date(`${currentYear}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(currentYear, parseInt(month), 0, 23, 59, 59, 999);

    // Common query to filter tasks by the year
    const monthQuery = {
      createdAt: { $gte: startDate, $lte: endDate },
    };
    // Count all products
    const totalProductsCount = await ProductListingModel.countDocuments(
      monthQuery
    );

    // Get the date 7 days ago from now
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Count products created in the last 7 days
    let newProductsCount = 0;
    if (sevenDaysAgo >= startDate && sevenDaysAgo <= endDate) {
      newProductsCount = await ProductListingModel.countDocuments({
        ...monthQuery,
        createdAt: { $gte: sevenDaysAgo },
      });
    }

    // Count products by category
    const productsByCategory = await ProductListingModel.aggregate([
      { $match: monthQuery },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    // Send the counts back in the response
    res.status(201).json({
      totalProductsCount,
      newProductsCount,
      productsByCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product counts", error });
  }
};
