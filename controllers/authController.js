// controllers/authController.js

const bcrypt = require('bcryptjs');
const baseHtml = require('../helpers/baseHtml');
const getNavBar = require('../helpers/getNavBar');

// Muestra el formulario de login
exports.showLoginForm = (req, res) => {
    const message = req.query.message || ''; // Captura mensajes de error/éxito de la URL
    const navBar = getNavBar(false); // No mostrar la barra de navegación en la página de login

    const loginFormHtml = `
        <div class="form-container">
            <h2>Iniciar Sesión</h2>
            <form action="/login" method="POST">
                ${message ? `<p class="error-message">${message}</p>` : ''}
                <label for="username">Usuario:</label>
                <input type="text" id="username" name="username" required>

                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>

                <button type="submit" class="button">Entrar</button>
            </form>
        </div>
    `;
    const html = baseHtml('Iniciar Sesión', `${navBar}<div class="content">${loginFormHtml}</div>`);
    res.send(html);
};

// Procesa el intento de login
exports.login = async (req, res) => {
    const { username, password } = req.body; // 'username' y 'password' son los valores del formulario
    
    // --- VERIFICACIÓN CRÍTICA DE LAS VARIABLES DE ENTORNO ---
    // Aseguramos que las variables esenciales estén cargadas de .env (en Render)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD_HASHED = process.env.ADMIN_PASSWORD_HASHED; // <-- ¡Esta es la variable clave que usamos ahora!
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASHED || !SECRET_KEY) {
        console.error('ERROR CRÍTICO: Variables de entorno de autenticación (ADMIN_USERNAME, ADMIN_PASSWORD_HASHED, SECRET_KEY) no están definidas. Revisa tu configuración en Render.');
        // Devuelve un error 500 al cliente si hay un problema de configuración del servidor
        return res.status(500).send('Error interno del servidor: Configuración de autenticación incompleta.');
    }
    // --- FIN DE LA VERIFICACIÓN CRÍTICA ---

    let isPasswordMatch = false;
    try {
        // Compara la contraseña en texto plano que el usuario introdujo ('password')
        // con el hash pre-generado que hemos guardado en la variable de entorno ('ADMIN_PASSWORD_HASHED')
        isPasswordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASHED);
    } catch (bcryptError) {
        // Captura cualquier error que pueda ocurrir durante la comparación de bcrypt
        console.error('Error durante la comparación de contraseñas (bcrypt.compare):', bcryptError);
        return res.status(500).send('Error interno en el proceso de autenticación.');
    }

    // Lógica de autenticación
    if (username === ADMIN_USERNAME && isPasswordMatch) {
        // Si las credenciales coinciden, establece la sesión
        req.session.userId = username;
        req.session.isAuthenticated = true;
        console.log('Login exitoso para el usuario:', username); // Log para depuración
        res.redirect('/dashboard'); // Redirige al dashboard
    } else {
        // Si las credenciales no coinciden
        console.log('Login fallido: Usuario o contraseña incorrectos.'); // Log para depuración
        res.redirect('/login?message=Usuario o contraseña incorrectos'); // Redirige de nuevo al login con un mensaje
    }
};

// Procesa el logout (cierre de sesión)
exports.logout = (req, res) => {
    // Destruye la sesión del usuario
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return res.redirect('/dashboard'); // Si hay un error, intentar redirigir de todos modos
        }
        // Redirige al login con un mensaje de éxito
        res.redirect('/login?message=Has cerrado sesión correctamente');
    });
};