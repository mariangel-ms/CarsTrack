require("dotenv").config();
const express = require('express');
const path = require('path');
const morgan = require("morgan");
const cors = require("cors"); // Permite peticiones del frontend
const cookieParser = require("cookie-parser"); // Lee las cookies[
const mongoose = require('mongoose');
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users');
const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json()); 
app.use(morgan('dev'));

(async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado con éxito a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error);
  }
})();

// Rutas frontend
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/img', express.static(path.resolve('img')));
app.use('/signup', express.static(path.resolve('views','signup')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/login', express.static(path.resolve('views', 'login')));

// Rutas backend
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

module.exports = app;