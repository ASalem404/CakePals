const Order = require('./../models/orderModel');
const User = require('./../models/userModel');
const Product = require('./../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { isBusy } = require('../utils/isBakerBusy');
const orderTime = require('../utils/orderTime');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  let orders;
  const userId = req.user.id;
  if (req.user.role === 'Baker') {
    orders = await Order.find({ baker: userId }).populate(['user', 'product']);
  } else {
    orders = await Order.find({ user: userId }).populate(['product', 'baker']);
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const populate = req.user.role == 'Baker' ? 'users' : 'product';
  const order = await Order.findById(req.params.id).populate(populate);
  if (order.user !== req.user.id) next(new AppError('Access denied', 403));
  if (!order) {
    return next(new AppError('No Orders found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new AppError('Trying to order product not exist', 404));
  req.body.user = req.user.id;
  req.body.product = req.params.id;
  req.body.baker = product.creator;
  const baker = await User.findById(req.body.baker);

  let currentOrderTime = orderTime(product._doc.bakingTime, next);
  const isBakerBusy = isBusy(baker.busyTime, currentOrderTime);

  // if the user is busy, return the order time is not available
  // if not, update the baker busy time by adding this order time to to it.
  if (isBakerBusy) {
    return res.status(206).json({
      status: 'Not Accepted',
      message: 'Baker is busy, order again later',
    });
  }
  const newOrder = await Order.create(req.body);

  const busyTime = [{ ...currentOrderTime, orderID: newOrder.id }].concat(
    baker.busyTime
  );
  console.log(busyTime);
  await User.findByIdAndUpdate(req.body.baker, {
    busyTime,
  });

  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  if (req.body.status && req.user.role !== 'Baker')
    return next(
      new AppError("You don't have permission to access this resource", 403)
    );

  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError('No Order found with that ID', 404));
  }

  // if the order bacame completed the remove its time from busy time to make
  // this time available next day
  if (req.body.status == 'completed') {
    await User.findByIdAndUpdate(
      order.baker,
      { $pull: { busyTime: { orderID: order._id } } },
      { new: true }
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

// we can also use another way for cancling the order through update the status of the order to be canceled
// without deleting it or deleting it after certain amount of time
exports.cancleOrder = catchAsync(async (req, res, next) => {
  if (req.user.role === 'Baker')
    new AppError("You don't have permission to access this resource", 403);
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError('No Order found with that ID', 404));
  }

  res.status(204).json();
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/api/v1/products/`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/products/`,
    customer_email: req.user.email,
    client_reference_id: req.params.orderId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: order.product.price,
          product_data: {
            name: `${order.product.type} `,
            description: order.product.type,
            images: [
              // Add the URLs of the images here
            ],
          },
        },
        quantity: order.quantity,
      },
    ],
    mode: 'payment',
  });

  res.redirect(session.url);
});
