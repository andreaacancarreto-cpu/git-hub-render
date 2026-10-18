const { Router } = require('express');
const router = Router();
const controller = require('../controllers/estudiante.controller');

// rutas del CRUD de estudiante
router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
