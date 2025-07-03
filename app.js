import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import ingresoRoutes from './routes/ingresoRoutes.js';
import verificarToken from './middlewares/authMiddleware.js'; // ✅ corregido
import gastoRoutes from './routes/gastoRoutes.js';


dotenv.config();
connectDB();

const app = express();  


app.use(cors());

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/ingresos', ingresoRoutes); // Ya usas verificarToken dentro de estas rutas
app.use('/api/gasto', gastoRoutes);

export default app;