import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import nodemailer from "nodemailer";

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({
      documentoidentidad,
      nombre,
      correo,
      password: hashedPassword,
      rol,
    });

    await nuevoUsuario.save();

    // Enviar correo de bienvenida
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CORREO_APP,
        pass: process.env.CORREO_APP_PASS,
      },
    });

    const mailOptions = {
      from: `"Soporte Cash Optimize" <${process.env.CORREO_APP}>`,
      to: correo,
      subject: "¡Bienvenido a Cash Optimize!",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Hola ${nuevoUsuario.nombre},</h2>
          <p>¡Tu cuenta ha sido registrada exitosamente en <strong>Cash Optimize</strong>!</p>
          <p>Ya puedes acceder con tu correo y contraseña.</p>
          <p>Si tienes alguna duda, no dudes en escribirnos.</p>
          <br/>
          <p>Gracias por confiar en nosotros.</p>
          <p><strong>Equipo de Cash Optimize</strong></p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Correo de bienvenida enviado a:", correo);
    } catch (error) {
      console.error("❌ Error al enviar correo de bienvenida:", error);
      // Puedes decidir si esto debe bloquear el registro o no
    }

    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (error) {
    console.error("❌ Error en register:", error);
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
    return res
      .status(500)
      .json({ msg: "Error en el servidor", error: error.message });
  }
};
