const express = require('express');
const { getCatalog, getProduct, createOrUpdateProduct, deleteProduct } = require('./Controllers/productController');
const verifyToken = require('./authMiddleware');
const verifyAdmin = require('./adminMiddleware'); 

const router = express.Router();

router.get('/productos', verifyToken, getCatalog);

router.get('/Producto/:ID', verifyToken, getProduct);
router.post('/Producto/:ID', verifyToken, verifyAdmin, createOrUpdateProduct);
router.post('/Producto/', verifyToken, createOrUpdateProduct);
router.delete('/Producto/:ID', verifyToken, verifyAdmin, deleteProduct);

module.exports = router;
