const mongoose = require("mongoose");
const User = require("./../models/userModel");
const Order = require("./../models/orderModel");
const Product = require("./../models/productModel");
const cache = require("../utils/cache");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getUser = catchAsync(async (req, res, next) => {
  const queryID = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(queryID))
    return next(new AppError("the input ID is not a valid ID", 422));

  const user = await User.findById(queryID).cache({ key: queryID });
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});
exports.busyTime = catchAsync(async (req, res, next) => {
  const queryID = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(queryID))
    return next(new AppError("the input ID is not a valid ID", 422));

  const user = await User.findById(queryID).select(
    "-busyTime._id -busyTime.orderID"
  );
  if (!user) {
    return next(new AppError("No User found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      busyTime: user.busyTime,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  res.cookie("jwt", "null", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 ==> An api return the orders of the Member and the Products of the Baker

  exports.getMyDeals = catchAsync(async (req, res, next) => {
  let deals;
  const populate = req.user.role == "Baker" ? "users" : "product";
  if (req.user.role === "Baker") {
    deals = await Product.find({ creator: req.user.id }).populate(populate);
  } else deals = await Order.find({ user: req.user.id }).populate(populate);
  res.status(200).json({
    status: "success",
    data: {
      deals,
    },
  });
});

 */
