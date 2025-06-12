require('dotenv').config(); // Carga las variables de entorno desde .env
const express = require('express');
const methodOverride = require('method-override'); // Para PUT y DELETE en formularios HTML
const session = require('express-session'); // Para gestionar sesiones de usuario (BONUS 4)
const connectDB = require('./config/db'); // Importa la función de conexión a la DB

// Importa las rutas
const productRoutes = require('./routes/productRoutes');
const apiRoutes = require('./routes/apiRoutes'); // BONUS 1
const authRoutes = require('./routes/authRoutes'); // BONUS 4

// Importa el middleware de autenticación (BONUS 4)
const { isAuthenticated } = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Conexión a la Base de Datos ---
connectDB();

// --- Middlewares Generales ---
app.use(express.urlencoded({ extended: true })); // Para parsear bodies de formularios (application/x-www-form-urlencoded)
app.use(express.json()); // Para parsear bodies de peticiones JSON (ej. para la API)
app.use(methodOverride('_method')); // Permite usar ?_method=PUT/DELETE en URLs de formularios
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'

// --- Configuración de Sesiones (BONUS 4) ---
app.use(session({
    secret: process.env.SECRET_KEY || 'supersecretkeydefault', // Clave secreta para firmar la cookie de sesión
    resave: false, // No guardar la sesión si no ha cambiado
    saveUninitialized: false, // No crear sesión para usuarios no autenticados
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true en producción (requiere HTTPS)
        maxAge: 1000 * 60 * 60 * 24 // Cookie expira en 24 horas
    }
}));

// --- Rutas ---
// Rutas de autenticación (login/logout)
app.use('/', authRoutes);

// Rutas del Dashboard (protegidas por autenticación)
// Todas las rutas que empiezan por /dashboard ahora requerirán que el usuario esté autenticado.
app.use('/dashboard', isAuthenticated, productRoutes);

// Rutas de la Tienda Principal y la API (no protegidas)
app.use('/', productRoutes); // Las rutas de la tienda (ej. /products) son públicas
app.use('/', apiRoutes);     // Las rutas de la API (ej. /api/products) también son públicas

// Ruta de Inicio por defecto: redirige a la lista de productos de la tienda
app.get('/', (req, res) => {
    res.redirect('/products');
});

// --- Iniciar el Servidor ---
// Solo inicia el servidor si no estamos en un entorno de test.
// Esto es útil para que Supertest pueda importar 'app' sin levantar un servidor real.
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
}

module.exports = app; // Exporta la instancia de app para los tests (BONUS 2)