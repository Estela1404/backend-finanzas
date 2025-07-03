import Gasto from '../models/gasto.js';

// Crear nuevo gasto
export const agregarGasto = async (req, res) => {
  const { descripcion, monto, cuenta, categoria, fecha, tipo } = req.body;

  const documentoidentidad = req.user?.documentoidentidad;

  if (!descripcion || !monto || !cuenta || !categoria || !fecha || !documentoidentidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const nuevoGasto = new Gasto({
      descripcion,
      monto,
      cuenta,
      categoria,
      fecha,
      tipo: tipo || 'gasto',
      documentoidentidad,
    });

    await nuevoGasto.save();
    res.status(201).json({ message: 'Gasto registrado con éxito', gasto: nuevoGasto });
  } catch (error) {
    console.error('Error al registrar el gasto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todos los gastos (admin o pruebas)
export const obtenerGasto = async (req, res) => {
  try {
    const gastos = await Gasto.find();
    res.status(200).json(gastos);
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener un gasto por ID
export const obtenerGastoPorId = async (req, res) => {
  try {
    const gasto = await Gasto.findById(req.params.id);
    if (!gasto) {
      return res.status(404).json({ message: 'Gasto no encontrado' });
    }
    res.status(200).json(gasto);
  } catch (error) {
    console.error('Error al obtener gasto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener gastos por usuario autenticado
export const obtenerGastosPorUsuario = async (req, res) => {
  try {
    const documento = req.user?.documentoidentidad;

    if (!documento) {
      return res.status(400).json({ message: 'Documento de identidad no encontrado en el token' });
    }

    const gastos = await Gasto.find({ documentoidentidad: documento });
    res.status(200).json(gastos);
  } catch (error) {
    console.error('Error al obtener los gastos del usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// 🔢 Obtener el total de gastos por usuario autenticado
export const obtenerTotalGastos = async (req, res) => {
  try {
    const documento = req.user?.documentoidentidad;

    if (!documento) {
      return res.status(400).json({ message: 'Documento de identidad no encontrado en el token' });
    }

    const gastos = await Gasto.find({ documentoidentidad: documento });
    const total = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);

    res.status(200).json({ total });
  } catch (error) {
    console.error('Error al obtener total de gastos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
