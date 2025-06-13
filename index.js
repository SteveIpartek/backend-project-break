// index.js

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// --- LOG DE INICIO DE INDEX.JS ---
// Este log nos ayuda a confirmar que esta versión del archivo se está cargando.
console.log('--- Cargando index.js: Verificación de orden de rutas y logs detallados ---');
// --- FIN LOG DE INICIO ---

const express = require('express');
const methodOverride = require('method-override'); // Para habilitar PUT y DELETE en formularios HTML
const session = require('express-session'); // Para gestionar las sesiones de usuario

// Importa la función de conexión a la base de datos
const connectDB = require('./config/db');

// Importa las definiciones de rutas
const productRoutes = require('./routes/productRoutes'); // Rutas para la tienda y el dashboard (HTML)
const apiRoutes = require('./routes/apiRoutes');         // Rutas para la API (JSON)
const authRoutes = require('./routes/authRoutes');       // Rutas para la autenticación (login/logout)

// Importa el middleware de autenticación para proteger rutas
const { isAuthenticated } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000; // Define el puerto, tomando de .env o usando 3000 por defecto

// --- 1. Conexión a la Base de Datos ---
connectDB();

// --- 2. Middlewares Generales ---
// Middleware para parsear bodies de formularios URL-encoded (para datos de formularios HTML)
app.use(express.urlencoded({ extended: true }));
// Middleware para parsear bodies de peticiones JSON (útil para la API)
app.use(express.json());
// Middleware para sobrescribir métodos HTTP (PUT, DELETE) en formularios HTML con '?_method=PUT'
app.use(methodOverride('_method'));
// Middleware para servir archivos estáticos (CSS, JavaScript, imágenes) desde la carpeta 'public'
app.use(express.static('public'));

// --- 3. Configuración de Sesiones ---
// ¡Importante! Este middleware DEBE ir antes de cualquier ruta que necesite acceder a req.session
app.use(session({
    secret: process.env.SECRET_KEY || 'supersecretkeydefault', // Clave secreta para firmar la cookie de sesión (¡usar una fuerte en .env!)
    resave: false, // No guardar la sesión si no ha cambiado
    saveUninitialized: false, // No crear sesión para usuarios no autenticados (hasta que se logeen)
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en producción para HTTPS (cookie solo se envía con HTTPS)
        maxAge: 1000 * 60 * 60 * 24 // La cookie de sesión expira en 24 horas
    }
}));

// --- 4. ORDEN CRÍTICO DE LAS RUTAS ---
// El orden en que se definen las rutas es fundamental en Express.

// PASO 1: Define las rutas de autenticación que NO necesitan protección.
// Estas son las primeras en procesarse para permitir el login y logout.
console.log('[DEBUG - INDEX] Configurando authRoutes (/)....');
app.use('/', authRoutes); // Maneja /login, /logout

// PASO 2: Define las rutas públicas (Tienda y API) que NO necesitan protección.
// Estas deben ir antes de CUALQUIER middleware de autenticación GLOBAL.
// Colocarlas aquí asegura que /products no active isAuthenticated.
console.log('[DEBUG - INDEX] Configurando public productRoutes (/) y apiRoutes (/)....');
app.use('/', productRoutes); // Maneja /products, /products/:productId
app.use('/', apiRoutes);     // Maneja /api/products, /api/products/:productId

// PASO 3: Define la ruta de inicio por defecto.
// Esta debería ser la última ruta general que maneja el path raíz.
// Es un "catch-all" para "/" si no ha sido manejado por authRoutes o productRoutes.
console.log('[DEBUG - INDEX] Configurando default root redirect (/)....');
app.get('/', (req, res) => {
    res.redirect('/products'); // Redirige a la lista de productos de la tienda
});

// PASO 4: Finalmente, define las rutas PROTEGIDAS del dashboard.
// Colocarlas aquí asegura que SOLO las rutas que empiezan con /dashboard
// activarán el middleware isAuthenticated.
console.log('[DEBUG - INDEX] Configurando dashboard routes (/dashboard) con isAuthenticated...');
app.use('/dashboard', isAuthenticated, productRoutes);


// --- 5. Iniciar el Servidor ---
// El servidor solo se inicia si el entorno no es de prueba (útil para Jest/Supertest).
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

// Log al finalizar la configuración de la aplicación
console.log('--- index.js cargado y Express app configurada completamente. ---');

// Exporta la instancia de la aplicación Express para que pueda ser utilizada en los tests
module.exports = app;