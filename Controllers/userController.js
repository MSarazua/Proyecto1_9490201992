const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require('email-validator');

exports.registerUser = async (req, res) => {
  try {
    const {
      DPI,
      Nombres,
      Apellidos,
      FechaNacimiento,
      Clave,
      ValidacionClave,
      DireccionEntrega,
      NIT,
      NúmeroTelefonico,
      CorreoElectronico,
      Rol
    } = req.body;

    if (
      !DPI ||
      !Nombres ||
      !Apellidos ||
      !FechaNacimiento ||
      !Clave ||
      !ValidacionClave ||
      !DireccionEntrega ||
      !NIT ||
      !NúmeroTelefonico ||
      !CorreoElectronico ||
      !Rol
    ) {
      return res
        .status(400)
        .json({ Mensaje: "Por favor, complete todos los campos." });
    }

    if (Clave !== ValidacionClave) {
      return res.status(400).json({ Mensaje: "Las contraseñas no coinciden." });
    }

    if (Clave.length < 8) {
      return res
        .status(400)
        .json({ Mensaje: "La contraseña debe tener al menos 8 caracteres." });
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({ Mensaje: "Usuario registrado exitosamente." });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ Mensaje: "DPI, NIT o Correo ya existen." });
    } else {
      res.status(500).json({ Mensaje: "Error al registrar el usuario.", error });
    }
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { CorreoElectronico, Clave } = req.body;

    const user = await User.findOne({ CorreoElectronico });
    if (!user) {
      return res
        .status(401)
        .json({ Mensaje: "Correo electrónico o contraseña incorrectos." });
    }

    const isMatch = await bcrypt.compare(Clave, user.Clave);
    if (!isMatch) {
      return res
        .status(401)
        .json({ Mensaje: "Correo electrónico o contraseña incorrectos." });
    }

    const payload = { userID: user.DPI };
    const token = jwt.sign(payload, "88DM3!g#wra9", { expiresIn: "1h" });

    res.json({ Mensaje: "Inicio de sesión exitoso.", Token: token });
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al iniciar sesión." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ DPI: req.params.DPI });
    if (!user)
      return res.status(404).json({ Mensaje: "Usuario no encontrado." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al obtener el perfil." });
  }
};

exports.updateProfile = async (req, res) => {
    const { Nombres, Apellidos, FechaNacimiento, Clave, DireccionEntrega, NIT, NúmeroTelefonico, CorreoElectronico } = req.body;

    if (!Nombres || !Apellidos || !FechaNacimiento || !Clave || !DireccionEntrega || !NIT || !NúmeroTelefonico || !CorreoElectronico) {
        return res.status(400).json({ Mensaje: 'Todos los campos son obligatorios.' });
    }

    if (!emailValidator.validate(CorreoElectronico)) {
        return res.status(400).json({ Mensaje: 'El formato del correo electrónico no es válido.' });
    }

    try {
        const dpiExists = await User.findOne({ DPI: req.params.DPI, _id: { $ne: req.user.userID } });
        const emailExists = await User.findOne({ CorreoElectronico, _id: { $ne: req.user.userID } });
        const nitExists = await User.findOne({ NIT, _id: { $ne: req.user.userID } });

        if (dpiExists) {
            return res.status(400).json({ Mensaje: 'El DPI ya está registrado.' });
        }
        if (emailExists) {
            return res.status(400).json({ Mensaje: 'El correo electrónico ya está registrado.' });
        }
        if (nitExists) {
            return res.status(400).json({ Mensaje: 'El NIT ya está registrado.' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { DPI: req.params.DPI },
            {
                Nombres,
                Apellidos,
                FechaNacimiento,
                Clave,
                DireccionEntrega,
                NIT,
                NúmeroTelefonico,
                CorreoElectronico
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ Mensaje: 'Usuario no encontrado.' });
        }

        res.json({ Mensaje: 'Perfil actualizado exitosamente.', updatedUser });
    } catch (error) {
        res.status(500).json({ Mensaje: 'Error al actualizar el perfil.' });
    }
};

exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ DPI: req.params.DPI });
    if (!user)
      return res.status(404).json({ Mensaje: "Usuario no encontrado." });
    res.json({ Mensaje: "Perfil eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ Mensaje: "Error al eliminar el perfil." });
  }
};
