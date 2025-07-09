// controllers/transferenciaController.js
import Transferencia from "../models/transferencia.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const crearTransferencia = async (req, res) => {
  try {
    const { cuentaOrigen, cuentaDestino, monto, descripcion } = req.body;

    if (!cuentaOrigen || !cuentaDestino || !monto) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (cuentaOrigen === cuentaDestino) {
      return res.status(400).json({ message: "Las cuentas no pueden ser iguales." });
    }

    // Obtener usuario desde el token
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no autorizado." });
    }

    // Crear la transferencia
    const nuevaTransferencia = new Transferencia({
      cuentaOrigen,
      cuentaDestino,
      monto,
      descripcion,
      usuario: usuario._id,
    });

    await nuevaTransferencia.save();

    res.status(201).json({ message: "Transferencia registrada correctamente." });
  } catch (error) {
    console.error("Error al crear transferencia:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
    