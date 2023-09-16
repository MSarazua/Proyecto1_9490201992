const jwt = require('jsonwebtoken');
const User = require('./Models/userModel');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Token');
        
        if (!token) {
            return res.status(401).json({ Mensaje: 'Token de autenticación no encontrado.' });
        }

        const decoded = jwt.verify(token, '88DM3!g#wra9'); 

        const user = await User.findById(decoded.userId);

        if (!user || user.Rol !== 'admin') {
            return res.status(403).json({ Mensaje: 'Acceso denegado. No tienes los permisos necesarios.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ Mensaje: 'Error al verificar el rol de administrador.' });
    }
};
