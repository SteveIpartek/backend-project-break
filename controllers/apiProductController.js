const Product = require('../models/Product');

// Obtener todos los productos (JSON)
exports.getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let products;
        if (category) {
            products = await Product.find({ category: category });
        } else {
            products = await Product.find();
        }
        res.json(products);
    } catch (error) {
        console.error('API Error: getAllProducts', error);
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
    }
};

// Obtener un producto por ID (JSON)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('API Error: getProductById', error);
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

// Crear un nuevo producto (JSON)
exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct); // 201 Created
    } catch (error) {
        console.error('API Error: createProduct', error);
        res.status(400).json({ message: 'Error al crear el producto', error: error.message });
    }
};

// Actualizar un producto por ID (JSON)
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('API Error: updateProduct', error);
        res.status(400).json({ message: 'Error al actualizar el producto', error: error.message });
    }
};

// Eliminar un producto por ID (JSON)
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('API Error: deleteProduct', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    }
};