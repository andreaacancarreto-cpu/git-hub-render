const { Estudiante } = require('../models');

// GET - lista todos los registros
exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await Estudiante.findAll();
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

// GET /:id - busca uno por su id
exports.obtenerPorId = async (req, res) => {
  try {
    const item = await Estudiante.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

// POST - crea un registro con lo que viene en el body
exports.crear = async (req, res) => {
  try {
    const nuevo = await Estudiante.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

// PUT /:id - actualiza solo los campos que se manden
exports.actualizar = async (req, res) => {
  try {
    const item = await Estudiante.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar', error: error.message });
  }
};

// DELETE /:id
exports.eliminar = async (req, res) => {
  try {
    const item = await Estudiante.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    await item.destroy();
    res.status(200).json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
