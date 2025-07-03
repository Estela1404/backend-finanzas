import Ingreso from '../models/ingreso.js';

export const agregarIngreso = async (req, res) => {
  try {
    const { descripcion, monto, cuenta, categoria, fecha, tipo } = req.body;

    if (!req.user || !req.user.documentoidentidad || !req.user.correo) {
      return res.status(401).json({ error: 'Usuario no autenticado o faltan datos.' });
    }

    const nuevoIngreso = new Ingreso({
      descripcion,
      monto,
      cuenta,
      categoria,
      fecha,
      tipo,
      documentoPersona: req.user.documentoidentidad,
      correoPersona: req.user.correo,
    });

    const ingresoGuardado = await nuevoIngreso.save();
    res.status(201).json(ingresoGuardado);
  } catch (error) {
    console.error("Error al guardar el ingreso:", error);
    res.status(500).json({ error: 'Error al guardar el ingreso' });
  }
};

export const obtenerMisIngresos = async (req, res) => {
  try {
    const documento = req.user?.documentoidentidad;
    if (!documento) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const ingresos = await Ingreso.find({ documentoPersona: documento }).sort({ createdAt: -1 });
    res.status(200).json(ingresos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los ingresos del usuario' });
  }
};

export const obtenerTotalIngresos = async (req, res) => {
  try {
    const documento = req.user?.documentoidentidad;
    if (!documento) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const ingresos = await Ingreso.find({ documentoPersona: documento });
    const total = ingresos.reduce((suma, ingreso) => suma + Number(ingreso.monto || 0), 0);
    res.status(200).json({ total });
  } catch (error) {
    console.error("Error al calcular el total de ingresos:", error);
    res.status(500).json({ error: 'Error al calcular el total de ingresos' });
  }
};

export const obtenerIngresos = async (req, res) => {
  try {
    const ingresos = await Ingreso.find().sort({ createdAt: -1 });
    res.status(200).json(ingresos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los ingresos' });
  }
};
