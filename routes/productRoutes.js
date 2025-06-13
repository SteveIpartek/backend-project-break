// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Importa el middleware de subida de imagen (Multer) desde el controlador de productos.
// 'upload' es la instancia de Multer configurada que maneja la subida de un solo archivo.
const { upload } = require('../controllers/productController');

// --- Rutas de la tienda principal (públicas, devuelven HTML) ---
// GET /products: Muestra todos los productos.
router.get('/products', productController.showProducts);
// GET /products/:productId: Muestra el detalle de un producto específico.
router.get('/products/:productId', productController.showProductById);

// --- Rutas del dashboard de administración (protegidas, devuelven HTML) ---
// Nota: El middleware 'isAuthenticated' se aplica en index.js para todas las rutas que empiezan con '/dashboard'

// GET /dashboard: Muestra todos los productos en el panel de administración.
router.get('/dashboard', productController.showDashboardProducts);
// GET /dashboard/new: Muestra el formulario para crear un nuevo producto.
router.get('/dashboard/new', productController.showNewProductForm);

// POST /dashboard: Crea un nuevo producto.
// ¡IMPORTANTE! El middleware 'upload' se ejecuta ANTES del controlador 'createProduct'.
// Esto asegura que Multer procese el archivo subido (imagen) y lo ponga en req.file antes de que el controlador actúe.
router.post('/dashboard', upload, productController.createProduct);

// GET /dashboard/:productId: Muestra el detalle de un producto específico en el dashboard (con opciones de editar/eliminar).
router.get('/dashboard/:productId', productController.showProductDetailDashboard);
// GET /dashboard/:productId/edit: Muestra el formulario para editar un producto.
router.get('/dashboard/:productId/edit', productController.showEditProductForm);

// PUT /dashboard/:productId: Actualiza un producto.
// ¡IMPORTANTE! El middleware 'upload' también se ejecuta ANTES del controlador 'updateProduct'.
// Manejará la subida de una nueva imagen si se selecciona, o mantendrá la existente.
router.put('/dashboard/:productId', upload, productController.updateProduct);

// DELETE /dashboard/:productId: Elimina un producto.
// (La parte de '/delete' en el path no es necesaria si ya usas el ID directamente).
router.delete('/dashboard/:productId', productController.deleteProduct);

module.exports = router;