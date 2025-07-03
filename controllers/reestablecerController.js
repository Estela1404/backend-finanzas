import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

export const reestablecerPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres" });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    const correo = decoded.correo;

    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(200).json({ msg: "Contraseña restablecida correctamente." });
  } catch (error) {
    console.error("Error al reestablecer contraseña:", error);
    res.status(500).json({ msg: "Token inválido o expirado." });
  }
};
