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

// Primero: Rutas de Autenticación
// Estas rutas (como /login, /logout) no necesitan autenticación previa.
console.log('[DEBUG - INDEX] Configurando authRoutes (/)....');
app.use('/', authRoutes);

// Segundo: Rutas Protegidas (Dashboard)
// Todas las rutas que empiezan por /dashboard primero pasarán por el middleware isAuthenticated.
// Si el usuario no está autenticado, isAuthenticated lo redirigirá al login.
console.log('[DEBUG - INDEX] Configurando dashboard routes (/dashboard) con isAuthenticated...');
app.use('/dashboard', isAuthenticated, productRoutes);

// Tercero: Rutas Públicas (Tienda y API)
// Estas rutas no requieren autenticación y son accesibles para todos.
// Se colocan después de las protegidas para evitar conflictos si una ruta protegida
// pudiera ser interpretada como una ruta pública general.
console.log('[DEBUG - INDEX] Configurando public productRoutes (/) y apiRoutes (/)....');
app.use('/', productRoutes); // Maneja /products, /products/:productId
app.use('/', apiRoutes);     // Maneja /api/products, /api/products/:productId

// Cuarto: Ruta de Inicio por defecto (última en el orden lógico)
// Esta es una ruta "catch-all" para la raíz. Solo se ejecutará si ninguna de las rutas anteriores
// ha manejado la petición.
console.log('[DEBUG - INDEX] Configurando default root redirect (/)....');
app.get('/', (req, res) => {
    res.redirect('/products'); // Redirige a la lista de productos de la tienda
});

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