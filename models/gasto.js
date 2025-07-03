import mongoose from 'mongoose';

const gastoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  cuenta: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  tipo: {
    type: String,
    default: 'gasto',
  },
  documentoidentidad: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Gasto', gastoSchema);
