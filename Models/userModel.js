const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  DPI: { type: String, required: true, unique: true },
  Nombres: { type: String, required: true },
  Apellidos: { type: String, required: true },
  FechaNacimiento: { type: Date, required: true },
  Clave: { type: String, required: true },
  DireccionEntrega: { type: String, required: true },
  NIT: { type: String, required: true, unique: true },
  NúmeroTelefonico: { type: String, required: true },
  CorreoElectronico: { type: String, required: true, unique: true },
  Rol: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.Clave = await bcrypt.hash(this.Clave, salt);
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
