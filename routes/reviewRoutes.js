const router = require('express').Router({ mergeParams: true });
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setOrderUserIds,
} = require('../controllers/reviewController');

const { restrictTo, protect } = require('../controllers/authController');

router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('Member'), setOrderUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('Member'), updateReview)
  .delete(restrictTo('Member'), deleteReview);

module.exports = router;
