// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a MongoDB Atlas establecida con éxito.');
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error.message);
        process.exit(1); // Salir del proceso con error
    }
};

module.exports = connectDB;