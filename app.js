import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Importa todas tus rutas
import authRoutes from './routes/authRoutes.js';
import ingresoRoutes from './routes/ingresoRoutes.js';
import gastoRoutes from './routes/gastoRoutes.js';
import transferenciaRoutes from './routes/transferenciaRoutes.js';
import recurrenteRoutes from './routes/recurrenteRoutes.js'; // ⬅️ Añadido

// Si quieres usar el middleware global, descomenta esta línea:
// import verificarToken from './middlewares/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas (no requieren token)
app.use('/api', authRoutes);

// Rutas protegidas (requieren token dentro de cada ruta)
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/gasto', gastoRoutes);
app.use('/api/transferencias', transferenciaRoutes);
app.use('/api/recurrentes', recurrenteRoutes); // ⬅️ Añadido

export default app;
