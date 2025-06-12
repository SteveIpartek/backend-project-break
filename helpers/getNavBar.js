const getNavBar = (isDashboard = false) => {
    let navHtml = `
    <ul class="nav-links">
        <li><a href="/products">Tienda</a></li>
        <li><a href="/products?category=Camisetas">Camisetas</a></li>
        <li><a href="/products?category=Pantalones">Pantalones</a></li>
        <li><a href="/products?category=Zapatos">Zapatos</a></li>
        <li><a href="/products?category=Accesorios">Accesorios</a></li>
    `;
    if (isDashboard) {
        navHtml += `<li><a href="/dashboard">Dashboard</a></li>`;
        navHtml += `<li><a href="/dashboard/new" class="button">Nuevo Producto</a></li>`;
        // Formulario de Logout para el dashboard
        navHtml += `
            <li style="margin-left: auto;">
                <form action="/logout" method="POST" style="margin: 0;">
                    <button type="submit" class="button button-danger">Cerrar Sesión</button>
                </form>
            </li>
        `;
    }
    navHtml += `</ul>`;
    return navHtml;
};

module.exports = getNavBar;