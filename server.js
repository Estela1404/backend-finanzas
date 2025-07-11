// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Importa tus rutas
import authRoutes from "./routes/authRoutes.js";
import ingresoRoutes from "./routes/ingresoRoutes.js";
import gastoRoutes from "./routes/gastoRoutes.js";
import transferenciaRoutes from "./routes/transferenciaRoutes.js";
import recurrenteRoutes from "./routes/recurrenteRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    // Conectar a MongoDB y esperar confirmación
    await connectDB();

    const app = express();

    // Configuración de CORS
    app.use(
      cors({
        origin: process.env.CLIENT_URL, // Utilizamos la URL del cliente desde el .env
        credentials: true,
      })
    );

    // Middleware para parsear JSON
    app.use(express.json());

    // Rutas
    app.use("/api/auth", authRoutes);
    app.use("/api/ingresos", ingresoRoutes);
    app.use("/api/gasto", gastoRoutes);
    app.use("/api/transferencias", transferenciaRoutes);
    app.use("/api/recurrentes", recurrenteRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
