const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const authController = require("../controllers/authController");
const sortByLocation = require("../utils/sortByLocation");

//* caching is implemented in GET /api/v1/products and GET /api/v1/products/:id
//* cach is cleared after updating products or deleting an product

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // this method doesnt need authentication to be called
  // but in case you need to sort by location then you need to login or signup

  // if the user is authenticated then get his data to use his coordinates in the sort method.
  let targetLocation;
  if (req.cookies.jwt) {
    req.user = await authController.decode(req, next);
    targetLocation = req.user.location.coordinates;
  }
  if (!req.user && `${req.query.sort}`.includes("location"))
    return next(new AppError("Login to be able to sort by location", 404));

  const features = new APIFeatures(
    Product.find().populate("creator").cache({ key: req.originalUrl }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;
  const products = req.query?.sort?.includes("location")
    ? sortByLocation.sort(doc, targetLocation)
    : doc;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).cache({
    key: req.originalUrl,
  });
  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  req.body.creator = req.user.id;
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }
  res.status(204).json();
});
