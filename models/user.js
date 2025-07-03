import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'El correo no es válido']
  },
  password: {
    type: String,
    required: true
  },
  documentoidentidad: {
    type: String,
    required: true,
    trim: true
  },
  rol: {
    type: String,
    enum: ['user', 'admin'], // 🔁 corregido aquí
    default: 'user'
  }
});

// Índice único en correo
userSchema.index({ correo: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
  