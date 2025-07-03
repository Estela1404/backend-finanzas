import mongoose from "mongoose";

const ingresoSchema = new mongoose.Schema({
  descripcion: String,
  monto: Number,
  cuenta: String,
  categoria: String,
  fecha: Date,
  tipo: String,
  documentoPersona: {
    type: String,
    required: true,
  },
  correoPersona: {            // <-- aquí agregamos el correo
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Correo electrónico no válido"],
  },
}, { timestamps: true });

export default mongoose.model("Ingreso", ingresoSchema);
