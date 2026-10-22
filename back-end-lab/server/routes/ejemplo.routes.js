const { Router } = require('express');
const router = Router();
const verifyToken = require('../middlewares/verifyToken');

// ruta de prueba: solo responde si el token es valido
router.get('/', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Acceso autorizado',
    usuario: req.usuario,
  });
});

module.exports = router;
