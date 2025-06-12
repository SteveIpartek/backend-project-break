const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.get('/login', authController.showLoginForm); // Muestra el formulario de login
router.post('/login', authController.login);       // Procesa el login
router.post('/logout', authController.logout);     // Procesa el logout

module.exports = router;