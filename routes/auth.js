// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const jwtSecret = 'default_secret';
const User = require('../models/User');

// Registro de usuario
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
  body('password').isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres'),
  body('email').isEmail().withMessage('Ingrese un correo electrónico válido')
], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    const existingUserName = await User.findByUsername(username);
    const existingEmail = await User.findByEmail(email);

    if (existingUserName) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    if (existingEmail) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create(username, passwordHash, email);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("entra",username,password)
    const user = await User.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email:user.email
      }
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    res.json({ token, user:payload.user });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión, por favor inténtelo de nuevo más tarde' });
  }
});

module.exports = router;