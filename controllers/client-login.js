const clientLoginRouter = require("express").Router();
const Car = require("../models/car");
const jwt = require("jsonwebtoken");

clientLoginRouter.post('/', async (request, response) => {
  // console.log("Login request received");
  const { cedula, placa } = request.body;

 if (!cedula || !placa) {
    return response.status(400).json({ error: 'Cédula y placa son obligatorias.' });
  }

try{
    
const car = await Car.findOne({ placa: placa.toUpperCase() });

if (!car) {
  return response.status(404).json({ error: 'El vehículo no esta registrado.' });
}

if (car.cliente.cedula !== cedula) {
  return response.status(401).json({ error: 'Datos incorrectos.' });
}

const userForToken = {
  id: car.cliente._id,
  rol: 'cliente',
};

  const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });


  response.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expira en 1 día
    secure: process.env.NODE_ENV === 'production', // Solo se envía en producción
    httpOnly: true, // No accesible desde JavaScript
  });

  return response.status(200).json("Login exitoso");

} catch (error) {
console.error('Error crítico en client-login controlador:', error);
    return response.status(500).json({ error: 'Error interno del servidor al procesar el acceso.' });
}

  
});

module.exports = clientLoginRouter;