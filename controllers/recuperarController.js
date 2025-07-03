import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const recuperarPassword = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ msg: "El correo es obligatorio" });
  }

  try {
    const user = await User.findOne({ correo });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Crear token con expiración de 15 min
    const resetToken = jwt.sign(
      { correo: user.correo },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

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
      subject: "Recuperación de contraseña",
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="http://localhost:5173/reestablecer/${resetToken}">Restablecer contraseña</a>
        <p>Si no solicitaste este correo, ignóralo.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Correo enviado con instrucciones para restablecer tu contraseña." });

  } catch (error) {
    console.error("Error al enviar correo:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
