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

// Obtener TODOS mis ingresos (incluyendo total)
router.get('/', verificarToken, obtenerMisIngresos);

// Obtener el total de mis ingresos (pero usando la misma ruta /api/ingresos)
router.get('/resumen', verificarToken, obtenerTotalIngresos); // Opcional: esta ruta sí usa "subpath", pero no es "total"

export default router;
