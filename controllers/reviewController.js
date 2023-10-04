const Review = require('../models/reviewModel');

const {
  getAll,
  getOne,
  createOne,
  deleteOne,
  updateOne,
} = require('./crudFactory');

exports.setOrderUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.order) req.body.order = req.params.orderId || req.params.id;
  next();
};

exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
