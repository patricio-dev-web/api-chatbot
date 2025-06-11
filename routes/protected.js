// routes/protected.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

// Ruta protegida
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida' });
});

module.exports = router;
