const express = require('express');
const {
  addProduct,
  getProducts,
  deleteProduct,
  getProduct,
  updateProduct,
  productsCount,
} = require('../controllers/productListing/productListing.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyCoordinator = require('../middlewares/verifyCoOrdinator');

const router = express.Router();

router.post('/post-product', verifyToken, verifyCoordinator, addProduct); // add new product
router.get('/get-products', verifyToken, verifyCoordinator, getProducts); // get all products
router.get('/get-product/:id', verifyToken, verifyCoordinator, getProduct); // get single products
router.delete(
  '/delete-product/:id',
  verifyToken,
  verifyCoordinator,
  deleteProduct
); // delete a products
router.patch(
  '/edit-product/:id',
  verifyToken,
  verifyCoordinator,
  updateProduct
); // update a products
router.get(
  '/get-products-counts/:month',
  verifyToken,
  verifyCoordinator,
  productsCount
); // products related count

module.exports = router;
