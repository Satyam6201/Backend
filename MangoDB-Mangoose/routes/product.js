const express = require('express');
const productController = require('../controller/product');

const router = express.Router();

router
  .post('/', productController.createProduct)
  .get('/', productController.getProduct)
  .get('/:id', productController.getProductById)
  .put('/:id', productController.updateAllFeatureProduct)
  .patch('/:id', productController.updateSomeFeatureProduct)
  .delete('/:id', productController.deleteProduct);

exports.router = router;  