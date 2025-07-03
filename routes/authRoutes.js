// routes/authRoutes.js
import express from 'express';
import { login } from '../controllers/authController.js';
import { register } from '../controllers/registerController.js';
import { getAllUsers, deleteUser, updateUser } from '../controllers/adminController.js';
import { recuperarPassword } from '../controllers/recuperarController.js';
import { reestablecerPassword } from '../controllers/reestablecerController.js'; // AÑADIDO

const router = express.Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/register', register);
router.post('/recuperar', recuperarPassword);
router.post('/reestablecer/:token', reestablecerPassword);  


router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);

export default router;  
