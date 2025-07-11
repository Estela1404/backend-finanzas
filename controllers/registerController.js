import bcrypt from "bcryptjs";
import User from "../models/user.js";
import nodemailer from "nodemailer";

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
      password: hashedPassword,
      documentoidentidad,
      rol: rol || "user",
    });

    await newUser.save();

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
          <h2>Hola ${newUser.nombre},</h2>
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
    }

    // Responder al cliente (sin password)
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
