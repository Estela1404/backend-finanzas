// routes/recurrenteRoutes.js
import express from "express";
import { obtenerGastosRecurrentes } from "../controllers/recurrenteController.js";
import verificarToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/recurrentes
router.get("/", verificarToken, obtenerGastosRecurrentes);

export default router;
