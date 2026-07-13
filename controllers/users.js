const usersRouter = require('express').Router();
const User = require('../models/user'); // Asegúrate de que esta ruta a tu modelo sea correcta
const bcrypt = require('bcrypt');
const axios = require('axios');

// Ruta para registrar un nuevo usuario
usersRouter.post('/', async (request, response) => {
  const { name, email, password, cedula } = request.body;

  // Validamos que ningún campo llegue vacío desde el frontend
  if (!name || !email || !password || !cedula) {
    return response
      .status(400)
      .json({ error: 'Todos los espacios son requeridos' });
  }

  try {
    // 1. Verificar si el email ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return response
        .status(400)
        .json({ error: 'El email ya se encuentra en uso' });
    }

    // 2. Validación real del correo mediante Abstract API
    const apiKey = process.env.API_KEY;
    const url = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
    
    const abstractResponse = await axios.get(url);
    const status = abstractResponse.data?.email_deliverability?.status;

    if (status === 'undeliverable') {
      return response
        .status(400)
        .json({ error: 'El correo electrónico proporcionado no existe o no es válido.' });
    }

    // 3. Encriptar la contraseña si el correo es válido
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Crear el documento con Mongoose
    const newUser = new User({
      name,
      email,
      passwordHash,
      cedula,
      verified: true,
    });

    // 5. Guardar en MongoDB Atlas
    await newUser.save();
    
    return response.status(201).json('Usuario creado exitosamente');

  } catch (error) {
    console.error('Error durante el proceso de registro:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor al procesar el registro.' });
  }
});

module.exports = usersRouter;