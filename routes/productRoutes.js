const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas de la tienda principal (públicas, devuelven HTML)
router.get('/products', productController.showProducts);
router.get('/products/:productId', productController.showProductById);

// Rutas del dashboard de administración (protegidas, devuelven HTML)
// Nota: El middleware 'isAuthenticated' se aplica en index.js para todas las rutas '/dashboard'
router.get('/dashboard', productController.showDashboardProducts); // Mostrar todos los productos en el dashboard
router.get('/dashboard/new', productController.showNewProductForm); // Formulario para crear un nuevo producto
router.post('/dashboard', productController.createProduct); // Crear un nuevo producto
router.get('/dashboard/:productId', productController.showProductDetailDashboard); // Detalle del producto en el dashboard
router.get('/dashboard/:productId/edit', productController.showEditProductForm); // Formulario para editar un producto
router.put('/dashboard/:productId', productController.updateProduct); // Actualizar un producto (usa _method=PUT)
router.delete('/dashboard/:productId', productController.deleteProduct); // Eliminar un producto (usa _method=DELETE)

module.exports = router;