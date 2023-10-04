const mongoose = require('mongoose');

const Order = require('./orderModel');
const User = require('./userModel');
const AppError = require('../utils/appError');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    modifiedAt: Date,
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Review must belong to a Order.'],
    },
    baker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Baker',
      required: [true, 'Review must belong to a Baker.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ order: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user order',
  });
  next();
});

reviewSchema.statics.calcAverageBakerRatings = async function (bakerId) {
  const stats = await this.aggregate([
    {
      $match: { baker: bakerId },
    },
    {
      $group: {
        _id: '$baker',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  const baker = await User.findById(bakerId);

  if (baker.role === 'Baker') {
    if (stats.length > 0) {
      await User.findByIdAndUpdate(bakerId, {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      });
    } else {
      await User.findByIdAndUpdate(bakerId, {
        ratingsQuantity: 0,
        ratingsAverage: 4.5,
      });
    }
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageBakerRatings(this.baker);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageBakerRatings(this.r.baker);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
