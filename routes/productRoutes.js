/**
 * Must be signed to be able to POST, update and delete
 * Only Baker can add, update and delete products
 * Cached Products will be automatically deleted after a successful update or post
 */
const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const clearCache = require("../middleware/clearCache");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("Baker"),
    clearCache.deleteKeysWithPrefix("/api/v1/products"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("Baker"),
    clearCache.deleteKeysWithPrefix("/api/v1/products"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("Baker"),
    clearCache.deleteKeysWithPrefix("/api/v1/products"),
    productController.deleteProduct
  );

module.exports = router;
