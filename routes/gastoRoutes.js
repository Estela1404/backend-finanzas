import express from 'express';
import {
  agregarGasto,
  obtenerGasto,
  obtenerGastoPorId,
  obtenerGastosPorUsuario,
  obtenerTotalGastos // ✅ IMPORTADO
} from '../controllers/gastoController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verificarToken, agregarGasto);
router.get('/mis-gasto', verificarToken, obtenerGastosPorUsuario);
router.get('/total', verificarToken, obtenerTotalGastos); // ✅ NUEVA RUTA

export default router;
