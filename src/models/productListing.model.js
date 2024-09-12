const mongoose = require('mongoose');

const productListingSchema = new mongoose.Schema(
  {
    taskCreator: {
      designation: { type: String },
      userId: { type: Number },
      name: { type: String },
    },
    department: {
      type: String,
      required: true,
    },
    disclaimer: {
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
    template_size: {
      type: [String],
      required: true,
    },
    template_category: {
      type: Number,
      required: true,
    },
    color_space: {
      type: String,
      required: true,
    },
    number_of_pages: {
      type: String,
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
    used: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductListingModel = mongoose.model(
  'ProductListing',
  productListingSchema
);

module.exports = ProductListingModel;
