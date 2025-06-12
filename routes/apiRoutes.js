const express = require('express');
const router = express.Router();
const apiProductController = require('../controllers/apiProductController');

// Rutas de la API (públicas, devuelven JSON)
router.get('/api/products', apiProductController.getAllProducts);
router.get('/api/products/:productId', apiProductController.getProductById);
router.post('/api/products', apiProductController.createProduct);
router.put('/api/products/:productId', apiProductController.updateProduct);
router.delete('/api/products/:productId', apiProductController.deleteProduct);

module.exports = router;