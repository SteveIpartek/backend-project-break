const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio.'],
        trim: true // Elimina espacios en blanco al inicio y al final
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria.']
    },
    image: {
        type: String, // Almacenará la URL de la imagen (ej. de Cloudinary)
        required: [true, 'La URL de la imagen es obligatoria.']
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria.'],
        enum: {
            values: ["Camisetas", "Pantalones", "Zapatos", "Accesorios"],
            message: 'Categoría no válida. Debe ser Camisetas, Pantalones, Zapatos o Accesorios.'
        }
    },
    size: {
        type: String,
        required: [true, 'La talla es obligatoria.'],
        enum: {
            values: ["XS", "S", "M", "L", "XL"],
            message: 'Talla no válida. Debe ser XS, S, M, L o XL.'
        }
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio.'],
        min: [0, 'El precio no puede ser negativo.']
    },
    createdAt: {
        type: Date,
        default: Date.now // Establece la fecha de creación automáticamente
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;