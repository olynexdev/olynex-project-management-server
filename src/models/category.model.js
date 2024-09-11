const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    category: {
      categoryName: { type: String, required: true },
      categoryNumber: { type: Number, required: true },
    },
    department: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model('Category', categorySchema);
module.exports = CategoryModel;
