const express = require("express");
const { addProduct, getProducts } = require("../controllers/productListing/productListing.controller");


const router = express.Router()

router.post("/post-product", addProduct) // add new product
router.get("/get-products", getProducts) // get all products


module.exports = router;