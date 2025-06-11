// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("El token: ",token)
  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'default_secret');
    console.log("asdasdasdasdasd: ",decoded)

    req.user = decoded.user;

    console.log("El user: ",req.user)

    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ error: 'Token de autenticación inválido' });
  }
};

module.exports = { verifyToken };
