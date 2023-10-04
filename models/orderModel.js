const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "Order must belong to a product "],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a User"],
  },
  baker: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must have a Baker"],
  },
  quantity: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "accepted", "rejected", "completed"],
    },
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
