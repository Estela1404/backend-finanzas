// controllers/recurrenteController.js
import mongoose from "mongoose";
import Gasto from "../models/gasto.js";

export const obtenerGastosRecurrentes = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Para confirmar que llega bien el id

    const usuarioId = new mongoose.Types.ObjectId(req.user.id);

    const gastos = await Gasto.aggregate([
      { $match: { usuario: usuarioId } },
      {
        $group: {
          _id: "$categoria",
          cantidad: { $sum: 1 },
          totalGastado: { $sum: "$monto" },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);

    res.json(gastos);
  } catch (error) {
    console.error("Error al obtener gastos recurrentes:", error.message);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
