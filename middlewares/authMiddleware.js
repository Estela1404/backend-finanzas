// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

console.log(
  "JWT_SECRET (visible solo en desarrollo):",
  JWT_SECRET ? "Cargada correctamente" : "ERROR: JWT_SECRET no cargada!"
);

const verificarToken = (req, res, next) => {
  console.log("\n--- DEBUG verificarToken ---");
  console.log("Método de la solicitud:", req.method);
  console.log("Ruta solicitada:", req.originalUrl);
  console.log("Headers recibidos:", req.headers);
  console.log("--- Fin DEBUG ---\n");

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("DEBUG: Token no encontrado o malformado.");
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.id,
      nombre: payload.nombre,
      correo: payload.correo,
      documentoidentidad: payload.documentoidentidad,
    };

    console.log("DEBUG: Token verificado exitosamente para usuario ID:", req.user.id);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log("DEBUG: El token ha expirado.");
      return res.status(401).json({ error: 'Token expirado. Por favor inicia sesión nuevamente.' });
    } else {
      console.log("DEBUG: Error al verificar el token:", error.message);
      return res.status(401).json({ error: 'Token inválido.' });
    }
  }
};

export default verificarToken;
