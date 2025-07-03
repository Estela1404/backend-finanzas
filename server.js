// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ingresoRoutes from './routes/ingresoRoutes.js';
import gastoRoutes from './routes/gastoRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Configuración CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de ingresos
app.use('/api/ingresos', ingresoRoutes);

// Rutas de gastos
app.use('/api/gasto', gastoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
