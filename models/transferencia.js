// models/transferencia.js
import mongoose from "mongoose";

const transferenciaSchema = new mongoose.Schema({
  cuentaOrigen: {
    type: String,
    required: true,
  },
  cuentaDestino: {
    type: String,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Transferencia = mongoose.model("Transferencia", transferenciaSchema);

export default Transferencia;
