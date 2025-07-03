// routes/ingresoRoutes.js
import express from 'express';
import {
  agregarIngreso,
  obtenerMisIngresos,
  obtenerTotalIngresos
} from '../controllers/ingresoController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registrar un ingreso
router.post('/', verificarToken, agregarIngreso);

// Obtener SOLO mis ingresos
router.get('/mis-ingresos', verificarToken, obtenerMisIngresos);

// Obtener el total de mis ingresos
router.get('/total', verificarToken, obtenerTotalIngresos);

export default router;
