const bcrypt = require('bcryptjs'); // Para comparar contraseñas de forma segura
const baseHtml = require('../helpers/baseHtml');
const getNavBar = require('../helpers/getNavBar');

// Muestra el formulario de login
exports.showLoginForm = (req, res) => {
    const message = req.query.message || ''; // Captura mensajes de error/éxito de la URL
    // No mostramos la barra de navegación para el login
    const navBar = getNavBar(false);
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
    const { username, password } = req.body;
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Obtenemos la contraseña SIN hashear del .env

    // En un proyecto real, buscarías al usuario en una base de datos y su contraseña hasheada.
    // Para este ejemplo, comparamos con un usuario y contraseña definidos en .env.
    // Aquí, hasheamos la contraseña de .env EN CADA LOGIN para compararla con la que ingresa el usuario.
    // Esto es para la SIMPLIFICACIÓN del ejemplo. En una aplicación real, el ADMIN_PASSWORD en .env
    // debería ser el hash *ya generado* de la contraseña real, y se compararía directamente ese hash.
    const isPasswordMatch = await bcrypt.compare(password, await bcrypt.hash(ADMIN_PASSWORD, 10)); // Compara la contraseña ingresada con el hash de la contraseña del .env

    if (username === ADMIN_USERNAME && isPasswordMatch) {
        req.session.userId = username; // Almacena el nombre de usuario en la sesión
        req.session.isAuthenticated = true; // Marca la sesión como autenticada
        res.redirect('/dashboard'); // Redirige al dashboard si las credenciales son correctas
    } else {
        res.redirect('/login?message=Usuario o contraseña incorrectos'); // Redirige al login con mensaje de error
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
        res.redirect('/login?message=Has cerrado sesión correctamente'); // Redirige al login con mensaje de éxito
    });
};