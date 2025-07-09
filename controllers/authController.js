import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;

// ---------- REGISTRO ----------
export const register = async (req, res) => {
  try {
    const { documentoidentidad, nombre, correo, password, rol } = req.body;

    if (!documentoidentidad || !nombre || !correo || !password || !rol) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const userExists = await User.findOne({ correo });
    if (userExists) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // ✅ Encriptar la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      documentoidentidad,
      nombre,
      correo,
      password: hashedPassword, // Guardar hasheada
      rol,
    });

    await nuevoUsuario.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
    }

    // ✅ Comparar contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Correo o contraseña incorrectos" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        documentoidentidad: user.documentoidentidad,
        rol: user.rol,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      msg: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        documentoidentidad: user.documentoidentidad,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
};
