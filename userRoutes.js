const express = require('express');
const verifyToken = require('./authMiddleware');
const { registerUser, loginUser, getProfile, updateProfile, deleteProfile } = require('./Controllers/userController');


const router = express.Router();

router.post('/registro/:DPI', registerUser);
router.post('/login', loginUser);

router.get('/perfil/:DPI', verifyToken, getProfile);
router.post('/perfil/:DPI', verifyToken, updateProfile);
router.delete('/perfil/:DPI', verifyToken, deleteProfile);

module.exports = router;
