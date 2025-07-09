import express from "express";
import { crearTransferencia } from "../controllers/transferenciaController.js";

const router = express.Router();

router.post("/", crearTransferencia);

export default router;
