// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("ERROR: JWT_SECRET no está definido en las variables de entorno.");
  process.exit(1);
}

const verificarToken = (req, res, next) => {
  console.log("\n--- DEBUG verificarToken ---");
  console.log("Método de la solicitud:", req.method);
  console.log("Ruta solicitada:", req.originalUrl);
  console.log("Headers recibidos:", req.headers);
  console.log("--- Fin DEBUG ---\n");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("DEBUG: Cabecera Authorization no proporcionada o mal formada.");
    return res.status(401).json({ error: "Token no proporcionado o mal formado." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.id,
      nombre: payload.nombre,
      correo: payload.correo,
      documentoidentidad: payload.documentoidentidad,
    };

    console.log("DEBUG: Token verificado correctamente. Usuario ID:", req.user.id);

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("DEBUG: El token ha expirado.");
      return res.status(401).json({
        error: "Token expirado. Por favor inicia sesión nuevamente.",
      });
    }
    console.log("DEBUG: Error al verificar el token:", error.message);
    return res.status(401).json({
      error: "Token inválido.",
    });
  }
};

export default verificarToken;
