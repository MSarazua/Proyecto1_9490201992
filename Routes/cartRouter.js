const express = require('express');
const router = express.Router();

const verifyToken = require('../authMiddleware');
const { getCart, updateCartItem, deleteCartItem } = require('../Controllers/cartController');

router.get('/carrito', verifyToken, getCart);

router.post('/carrito', verifyToken, updateCartItem);

router.delete('/carrito', verifyToken, deleteCartItem);

module.exports = router;
