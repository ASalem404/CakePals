const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Please provide the product name!"],
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a User"],
  },
  bakingTime: {
    type: Object,
    required: [true, "the Product must have a backing time hours and minutes"],
  },
  price: {
    type: Number,
    required: [true, "The product must have a price"],
  },
});
// productSchema.index({ "creator.location": "2dsphere" });
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
