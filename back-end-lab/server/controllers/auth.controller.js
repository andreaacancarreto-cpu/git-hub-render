const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /api/auth/registrar
exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;

    if (!password) return res.status(400).json({ message: 'El password es obligatorio' });

    // nunca se guarda el password tal cual, se encripta
    const passwordHasheado = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheado,
      rol_id,
    });

    res.status(201).json({ message: 'Usuario creado', id: nuevoUsuario.id });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// POST /api/auth/login -> devuelve el token si el email y password estan bien
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // el token lleva el id y el rol, dura 8 horas
    const token = jwt.sign(
      { id: usuario.id, rol_id: usuario.rol_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};
