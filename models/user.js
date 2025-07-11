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
    unique: true, // esto ya crea un índice único
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
    enum: ['user', 'admin'],
    default: 'user'
  }
});

// ✅ Ya no hay necesidad de userSchema.index

const User = mongoose.model('User', userSchema);

export default User;
