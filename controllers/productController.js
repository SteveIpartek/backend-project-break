// controllers/productController.js

// --- Importaciones ---
const Product = require('../models/Product');
const baseHtml = require('../helpers/baseHtml');
const getNavBar = require('../helpers/getNavBar');
const getProductCards = require('../helpers/getProductCards');
const getProductForm = require('../helpers/getProductForm');

// Importa Multer y la configuración de Cloudinary
const multer = require('multer');
const cloudinary = require('../config/cloudinary'); // Asegúrate de que config/cloudinary.js exporta 'cloudinary'

// --- Configuración de Multer ---
const storage = multer.memoryStorage();
exports.upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limita el tamaño del archivo a 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp).'), false);
        }
    }
}).single('imageFile'); // 'imageFile' debe coincidir con el 'name' del input type="file" en tu formulario

// --- Funciones del Controlador ---

exports.showProducts = async (req, res) => {
    console.log(`[DEBUG - showProducts] Accediendo a /products. Ruta original: ${req.originalUrl}`);
    try {
        const { category } = req.query;
        let products;
        if (category) {
            products = await Product.find({ category: category });
        } else {
            products = await Product.find();
        }
        const navBar = getNavBar(false);
        const productCards = getProductCards(products, false);
        const html = baseHtml('Nuestra Tienda', `${navBar}<div class="content">${productCards}</div>`);
        res.send(html);
    } catch (error) {
        console.error('Error en showProducts:', error);
        res.status(500).send('Error al obtener los productos de la tienda.');
    }
};

exports.showProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }
        const navBar = getNavBar(false);
        const productDetailHtml = `
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p><strong>Descripción:</strong> ${product.description}</p>
                <p><strong>Categoría:</strong> ${product.category}</p>
                <p><strong>Talla:</strong> ${product.size}</p>
                <p><strong>Precio:</strong> ${product.price}€</p>
                <a href="/products" class="button">Volver a la tienda</a>
            </div>
        `;
        const html = baseHtml('Detalle del Producto', `${navBar}<div class="content">${productDetailHtml}</div>`);
        res.send(html);
    } catch (error) {
        console.error('Error en showProductById:', error);
        res.status(500).send('Error al obtener el detalle del producto.');
    }
};

exports.showDashboardProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const navBar = getNavBar(true);
        const productCards = getProductCards(products, true);
        const dashboardHtml = `
            <h1>Dashboard de Administración</h1>
            ${productCards}
        `;
        const html = baseHtml('Dashboard de Productos', `${navBar}<div class="content">${dashboardHtml}</div>`);
        res.send(html);
    } catch (error) {
        console.error('Error en showDashboardProducts:', error);
        res.status(500).send('Error al obtener los productos del dashboard.');
    }
};

exports.showNewProductForm = (req, res) => {
    const navBar = getNavBar(true);
    const formHtml = getProductForm();
    const html = baseHtml('Nuevo Producto', `${navBar}<div class="content">${formHtml}</div>`);
    res.send(html);
};

exports.createProduct = async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
                folder: 'tienda_ropa_productos'
            });
            imageUrl = result.secure_url;
        } else {
            return res.status(400).send('Es obligatorio subir una imagen para el producto.');
        }

        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            image: imageUrl,
            category: req.body.category,
            size: req.body.size,
            price: req.body.price
        });

        await newProduct.save();
        res.redirect(`/dashboard/${newProduct._id}`);
    } catch (error) {
        console.error('Error en createProduct (con subida de imagen):', error);
        res.status(400).send('Error al crear el producto: ' + error.message);
    }
};

exports.showProductDetailDashboard = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado en el dashboard.');
        }
        const navBar = getNavBar(true);
        const productDetailHtml = `
            <div class="product-detail">
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p><strong>Descripción:</strong> ${product.description}</p>
                <p><strong>Categoría:</strong> ${product.category}</p>
                <p><strong>Talla:</strong> ${product.size}</p>
                <p><strong>Precio:</strong> ${product.price}€</p>
                <div class="action-buttons">
                    <a href="/dashboard/${product._id}/edit" class="button">Editar</a>
                    <form action="/dashboard/${product._id}?_method=DELETE" method="POST" style="display:inline;">
                        <button type="submit" class="button button-danger">Eliminar</button>
                    </form>
                    <a href="/dashboard" class="button button-secondary">Volver al Dashboard</a>
                </div>
            </div>
        `;
        const html = baseHtml('Detalle del Producto (Admin)', `${navBar}<div class="content">${productDetailHtml}</div>`);
        res.send(html);
    } catch (error) {
        console.error('Error en showProductDetailDashboard:', error);
        res.status(500).send('Error al obtener el detalle del producto para el dashboard.');
    }
};

exports.showEditProductForm = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send('Producto no encontrado para editar.');
        }
        const navBar = getNavBar(true);
        const formHtml = getProductForm(product, true);
        const html = baseHtml('Editar Producto', `${navBar}<div class="content">${formHtml}</div>`);
        res.send(html);
    } catch (error) {
        console.error('Error en showEditProductForm:', error);
        res.status(500).send('Error al cargar el formulario de edición.');
    }
};

// --- Modificación de updateProduct para manejar correctamente la imagen ---
exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        let imageUrl;

        if (req.file) {
            // Si se subió un NUEVO archivo de imagen, cárgalo a Cloudinary
            const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
                folder: 'tienda_ropa_productos'
            });
            imageUrl = result.secure_url; // Usa la URL de la nueva imagen
        } else if (req.body.existingImage) {
            // Si NO se subió un nuevo archivo, pero hay una imagen existente (campo oculto)
            imageUrl = req.body.existingImage; // Mantén la URL de la imagen existente
        } else {
            // Si NO se subió un archivo y NO hay una imagen existente (ej. se borró o nunca hubo)
            // Aquí puedes decidir si hacer la imagen opcional o requerir una nueva
            return res.status(400).send('Se requiere una imagen para actualizar el producto.');
        }

        // Crea el objeto con los datos a actualizar
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            image: imageUrl, // Usa la URL determinada (nueva o existente)
            category: req.body.category,
            size: req.body.size,
            price: req.body.price
        };

        // Actualiza el producto
        await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

        res.redirect(`/dashboard/${productId}`);
    } catch (error) {
        console.error('Error en updateProduct (con subida de imagen):', error);
        res.status(400).send('Error al actualizar el producto: ' + error.message);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);
        if(product && product.image) {
            // Opcional: Eliminar la imagen de Cloudinary al borrar el producto
            // Extracción del public_id: asume que la URL es algo como
            // https://res.cloudinary.com/cloud_name/image/upload/vHASH/folder/public_id.extension
            const urlParts = product.image.split('/');
            const folderAndPublicId = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
            const publicIdWithoutExtension = folderAndPublicId.split('.')[0];
            
            // Si usas una carpeta específica en Cloudinary al subir, inclúyela aquí.
            // Por ejemplo, si tu carpeta es 'tienda_ropa_productos', el publicId completo es 'tienda_ropa_productos/nombre_imagen'
            await cloudinary.uploader.destroy(publicIdWithoutExtension);
            console.log(`Imagen ${publicIdWithoutExtension} eliminada de Cloudinary.`);
        }
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        res.status(500).send('Error al eliminar el producto.');
    }
};