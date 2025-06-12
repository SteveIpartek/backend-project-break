const getProductCards = (products, isDashboard = false) => {
    if (!products || products.length === 0) {
        return '<p>No hay productos disponibles.</p>';
    }

    let html = '<div class="product-grid">';
    for (let product of products) {
        // El enlace de detalle cambia si estamos en el dashboard o en la tienda
        const detailLink = isDashboard ? `/dashboard/${product._id}` : `/products/${product._id}`;
        html += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description.substring(0, 70)}...</p>
            <p class="price">${product.price}€</p>
            <a href="${detailLink}" class="button">Ver Detalle</a>
        </div>
        `;
    }
    html += '</div>';
    return html;
};

module.exports = getProductCards;