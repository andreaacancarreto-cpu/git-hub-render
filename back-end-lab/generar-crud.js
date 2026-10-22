// script para no escribir el CRUD a mano cada vez
// uso: node generar-crud.js NombreDelModelo   (ej: node generar-crud.js Estudiante)
// crea el controller y las rutas dentro de server/
const fs = require('fs');
const path = require('path');

const nombre = process.argv[2];
if (!nombre) {
  console.log('Uso: node generar-crud.js NombreDelModelo');
  process.exit(1);
}

const nombreMin = nombre.toLowerCase();

// OJO: el modelo se importa desde models/index.js, si se importa el archivo
// directo sale el error "create is not a function"
const controllerCode = `const { ${nombre} } = require('../models');

// GET - lista todos los registros
exports.obtenerTodos = async (req, res) => {
  try {
    const datos = await ${nombre}.findAll();
    res.status(200).json(datos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

// GET /:id - busca uno por su id
exports.obtenerPorId = async (req, res) => {
  try {
    const item = await ${nombre}.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};

// POST - crea un registro con lo que viene en el body
exports.crear = async (req, res) => {
  try {
    const nuevo = await ${nombre}.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear', error: error.message });
  }
};

// PUT /:id - actualiza solo los campos que se manden
exports.actualizar = async (req, res) => {
  try {
    const item = await ${nombre}.findByPk(req.params.id);
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
    const item = await ${nombre}.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'No encontrado' });
    await item.destroy();
    res.status(200).json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};
`;

const routesCode = `const { Router } = require('express');
const router = Router();
const verifyToken = require('../middlewares/verifyToken');
const controller = require('../controllers/${nombreMin}.controller');

// rutas del CRUD de ${nombreMin} (crear, editar y borrar piden token)
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', verifyToken, controller.crear);
router.put('/:id', verifyToken, controller.actualizar);
router.delete('/:id', verifyToken, controller.eliminar);

module.exports = router;
`;

// por si no existen las carpetas
fs.mkdirSync(path.join(__dirname, 'server', 'controllers'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'server', 'routes'), { recursive: true });

fs.writeFileSync(path.join(__dirname, 'server', 'controllers', `${nombreMin}.controller.js`), controllerCode);
fs.writeFileSync(path.join(__dirname, 'server', 'routes', `${nombreMin}.routes.js`), routesCode);

console.log(`Listo: se generaron ${nombreMin}.controller.js y ${nombreMin}.routes.js`);
console.log(`No olvidar agregar la ruta en app.js`);
