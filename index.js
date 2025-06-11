const express = require('express');
const authRoutesa = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const chatRoutes = require('./routes/chat');
const consultasRoutes = require('./routes/consultas');

const {verifyToken} = require('./middleware/authMiddleware')

const user = require('./routes/user');
const app = express();

const morgan = require('morgan');

const cors = require('cors');

app.use(morgan('dev'));

// Middleware
app.use(cors()); 

app.use(express.json());


// Middleware global para verificar el token en todas las solicitudes excepto las de inicio de sesión y registro
// app.use((req, res, next) => {
//   const isAuthPath = req.path === '/api/login' || req.path === '/api/register';
//   if (!isAuthPath) {
//     verifyToken(req, res, next);
//   } else {
//     next();
//   }
// });


// Rutas protegidas
app.use('/api', protectedRoutes);

app.use('/api', user);

// Rutas de autenticación
app.use('/api', authRoutesa);

app.use('/api', chatRoutes);
app.use('/api', consultasRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
