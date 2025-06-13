// helpers/getProductForm.js

const getProductForm = (product = {}, isEdit = false) => {
    const categories = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"];
    const sizes = ["XS", "S", "M", "L", "XL"];
    // Define la URL de acción del formulario:
    // - Para crear un nuevo producto, la acción es POST a /dashboard.
    // - Para editar/actualizar un producto, la acción es POST a /dashboard/:productId con ?_method=PUT.
    const actionUrl = isEdit ? `/dashboard/${product._id}?_method=PUT` : '/dashboard';
    // El método del formulario siempre es POST, ya que method-override manejará PUT/DELETE.
    const formMethod = 'POST';

    return `
    <div class="form-container">
        <h2>${isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form action="${actionUrl}" method="${formMethod}" enctype="multipart/form-data">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" value="${product.name || ''}" required>

            <label for="description">Descripción:</label>
            <textarea id="description" name="description" required>${product.description || ''}</textarea>

            <label for="imageFile">Imagen del Producto:</label>
            <input type="file" id="imageFile" name="imageFile" accept="image/*" ${isEdit && !product.image ? 'required' : ''}>

            ${isEdit && product.image ? `
                <p>Imagen actual: <a href="${product.image}" target="_blank">Ver imagen</a></p>
                <input type="hidden" name="existingImage" value="${product.image}">
            ` : ''}

            <label for="category">Categoría:</label>
            <select id="category" name="category" required>
                ${categories.map(cat => `<option value="${cat}" ${product.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
            </select>

            <label for="size">Talla:</label>
            <select id="size" name="size" required>
                ${sizes.map(s => `<option value="${s}" ${product.size === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>

            <label for="price">Precio:</label>
            <input type="number" id="price" name="price" value="${product.price || ''}" step="0.01" required>

            <button type="submit" class="button">${isEdit ? 'Actualizar Producto' : 'Crear Producto'}</button>
            ${isEdit ? `<a href="/dashboard" class="button button-secondary">Cancelar</a>` : ''}
        </form>
        ${isEdit ? `
        <form action="/dashboard/${product._id}?_method=DELETE" method="POST" style="margin-top: 10px;">
            <button type="submit" class="button button-danger">Eliminar Producto</button>
        </form>
        ` : ''}
    </div>
    `;
};

module.exports = getProductForm;