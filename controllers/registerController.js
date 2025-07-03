import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const register = async (req, res) => {
  const { nombre, correo, password, documentoidentidad, rol } = req.body;

  // Validar campos obligatorios
  if (!nombre || !correo || !password || !documentoidentidad) {
    return res
      .status(400)
      .json({ msg: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ correo });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "El correo ya está registrado" });
    }

    // Hashear la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const newUser = new User({
      nombre,
      correo,
      password: hashedPassword, // Contraseña cifrada
      documentoidentidad,
      rol: rol || "user",
    });

    await newUser.save();

    // Responder con un mensaje de éxito sin incluir password
    res.status(201).json({
      msg: "Usuario registrado exitosamente",
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        correo: newUser.correo,
        documentoidentidad: newUser.documentoidentidad,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res
      .status(500)
      .json({ msg: "Error en el servidor", error: error.message });
  }
};
