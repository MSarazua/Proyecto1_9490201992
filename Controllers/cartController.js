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
            return res.status(404).json({ Mensaje: "No se encontró el carrito de compra." });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ Mensaje: "Error de búsqueda." });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { ProductoID, Cantidad } = req.body;

        const product = await Product.findById(ProductoID);
        if (!product) {
            return res.status(404).json({ Mensaje: "No se encontró el producto." });
        }

        if (Cantidad > product.Disponibilidad) {
            return res.status(400).json({ Mensaje: "Producto no disponible." });
        }

        await Cart.updateOne(
            { UsuarioID: userId, "Productos.ProductoID": ProductoID },
            { "Productos.$.Cantidad": Cantidad }
        );

        res.json({ Mensaje: "Se actualizó el carrito." });
    } catch (error) {
        res.status(500).json({ Mensaje: "No se pudo actualizar el carrito.", error });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { ProductoID } = req.body;

        await Cart.updateOne(
            { UsuarioID: userId },
            { $pull: { Productos: { ProductoID: ProductoID } } }
        );

        res.json({ Mensaje: "Se quitó el producto de la compra." });
    } catch (error) {
        res.status(500).json({ Mensaje: "No se pudo eliminar el producto.", error });
    }
};

