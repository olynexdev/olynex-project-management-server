const mongoose = require("mongoose");

const productListingSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  file_types: {
    type: [String],  
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  source_link: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  keywords: {
    type: String,
    required: true,
  },
  productId: {
    type: Number,
    required: true,
  },
  used:{
    type: Boolean,
    required: true
  }
}, { timestamps: true });

const ProductListingModel = mongoose.model("ProductListing", productListingSchema);

module.exports = ProductListingModel;
