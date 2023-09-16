const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Token');
    if (!token) return res.status(401).json({ Mensaje: 'Acceso denegado. Token no proporcionado.' });

    try {
        const verified = jwt.verify(token, '88DM3!g#wra9'); 
        req.user = verified; 
        next(); 
    } catch (error) {
        res.status(400).json({ Mensaje: 'Token inválido.' });
    }
};

module.exports = verifyToken;
