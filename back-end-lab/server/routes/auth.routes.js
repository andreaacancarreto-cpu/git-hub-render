const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');

// estas dos rutas no piden token
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

module.exports = router;
