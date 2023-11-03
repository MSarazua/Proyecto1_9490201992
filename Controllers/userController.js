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
        .json({ Mensaje: "Ingrese los campos requeridos." });
    }

    if (Clave !== ValidacionClave) {
      return res.status(400).json({ Mensaje: "La contraseña no coincide." });
    }

    if (Clave.length < 8) {
      return res
        .status(400)
        .json({ Mensaje: "Contraseña de 8 caracteres." });
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json({ Mensaje: "El usuario se registró con éxito." });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ Mensaje: "Hay campos ya existentes en la BD." });
    } else {
      res.status(500).json({ Mensaje: "No se pudo registrar el usuario.", error });
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

    res.json({ Mensaje: "Login exitoso.", Token: token, DPI: user.DPI});
  } catch (error) {
    res.status(500).json({ Mensaje: "No se pudo iniciar sesión." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ DPI: req.params.DPI });
    if (!user)
      return res.status(404).json({ Mensaje: "No se encontró el usuario." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ Mensaje: "El perfil no existe." });
  }
};

exports.updateProfile = async (req, res) => {
    const { Nombres, Apellidos, FechaNacimiento, Clave, DireccionEntrega, NIT, NúmeroTelefonico, CorreoElectronico } = req.body;

    if (!Nombres || !Apellidos || !FechaNacimiento || !Clave || !DireccionEntrega || !NIT || !NúmeroTelefonico || !CorreoElectronico) {
        return res.status(400).json({ Mensaje: 'Ingrese los campos requeridos.' });
    }

    if (!emailValidator.validate(CorreoElectronico)) {
        return res.status(400).json({ Mensaje: 'Ingrese un correo válido.' });
    }

    try {
        const dpiExists = await User.findOne({ DPI: req.params.DPI, _id: { $ne: req.user.userID } });
        const emailExists = await User.findOne({ CorreoElectronico, _id: { $ne: req.user.userID } });
        const nitExists = await User.findOne({ NIT, _id: { $ne: req.user.userID } });

        if (dpiExists) {
            return res.status(400).json({ Mensaje: 'DPI existente en la BD.' });
        }
        if (emailExists) {
            return res.status(400).json({ Mensaje: 'Correo existente en la BD.' });
        }
        if (nitExists) {
            return res.status(400).json({ Mensaje: 'NIT existente en la BD.' });
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
            return res.status(404).json({ Mensaje: 'El usuario no existe.' });
        }

        res.json({ Mensaje: 'Se actualizó el perfil.', updatedUser });
    } catch (error) {
        res.status(500).json({ Mensaje: 'No se actualizó el perfil.', error });
    }
};

exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ DPI: req.params.DPI });
    if (!user)
      return res.status(404).json({ Mensaje: "El usuario no existe." });
    res.json({ Mensaje: "Se eliminó el usuario." });
  } catch (error) {
    res.status(500).json({ Mensaje: "No se pudo eliminar el usuario.", error });
  }
};
