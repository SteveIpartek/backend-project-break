// Middleware para verificar si el usuario está autenticado
exports.isAuthenticated = (req, res, next) => {
    // Si la sesión existe y contiene un 'userId' (que establecimos al iniciar sesión)
    if (req.session && req.session.userId) {
        return next(); // El usuario está autenticado, permite que la petición continúe
    } else {
        // Si no hay sesión o no hay userId, redirige al formulario de login
        // Se añade un mensaje para informar al usuario
        return res.redirect('/login?message=Necesitas iniciar sesión para acceder al dashboard');
    }
};