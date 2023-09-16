const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../Models/userModel');
const Product = require('../Models/productModel');
const Cart = require('../Models/cartModel');

exports.getCart = async (req, res) => {
    try {
        const userId = req.user._id; 

        const cart = await Cart.findOne({ UsuarioID: userId }).populate('Productos.ProductoID');

        if (!cart) {
            return res.status(404).json({ Mensaje: "Carrito de compra no encontrado." });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ Mensaje: "Error al obtener el carrito de compra." });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { ProductoID, Cantidad } = req.body;

        const product = await Product.findById(ProductoID);
        if (!product) {
            return res.status(404).json({ Mensaje: "Producto no encontrado." });
        }

        if (Cantidad > product.Disponibilidad) {
            return res.status(400).json({ Mensaje: "No hay suficiente disponibilidad del producto." });
        }

        await Cart.updateOne(
            { UsuarioID: userId, "Productos.ProductoID": ProductoID },
            { "Productos.$.Cantidad": Cantidad }
        );

        res.json({ Mensaje: "Cantidad de producto actualizada en el carrito." });
    } catch (error) {
        res.status(500).json({ Mensaje: "Error al actualizar el carrito de compra." });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user._id; // Obtén el ID del usuario desde el token
        const { ProductoID } = req.body;

        // Elimina el producto del carrito de compra del usuario
        await Cart.updateOne(
            { UsuarioID: userId },
            { $pull: { Productos: { ProductoID: ProductoID } } }
        );

        res.json({ Mensaje: "Producto eliminado del carrito de compra." });
    } catch (error) {
        res.status(500).json({ Mensaje: "Error al eliminar el producto del carrito de compra." });
    }
};

