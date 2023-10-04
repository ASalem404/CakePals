const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECERT_KEY);

const {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrder,
  cancleOrder,
  getCheckoutSession,
} = require('./../controllers/orderController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/').get(getAllOrders);

router
  .route('/:id')
  .get(getOrder)
  .patch(updateOrder)
  .delete(cancleOrder)
  .post(authController.restrictTo('Member'), createOrder);
router.get('/buy/:orderId', getCheckoutSession);
module.exports = router;
