// cartModel.js

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    ProductoID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    Cantidad: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    UsuarioID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        unique: true
    },
    Productos: [cartItemSchema],
    Total: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('carts', cartSchema);