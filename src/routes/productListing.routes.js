const express = require('express');
const {
  addProduct,
  getProducts,
  deleteProduct,
  getProduct,
  updateProduct,
  productsCount,
} = require('../controllers/productListing/productListing.controller');

const router = express.Router();

router.post('/post-product', addProduct); // add new product
router.get('/get-products', getProducts); // get all products
router.get('/get-product/:id', getProduct); // get single products
router.delete('/delete-product/:id', deleteProduct); // delete a products
router.patch('/edit-product/:id', updateProduct); // update a products
router.get('/get-products-counts', productsCount); // products related count

module.exports = router;
