const carsRouter = require('express').Router();
const Car = require('../models/car');
const User = require('../models/user');

carsRouter.post('/', async (request, response) => {
  const { nombre, cedula, correo, telefono, placa, marca, modelo } = request.body;

  if (!nombre || !cedula || !placa || !marca || !modelo) {
    return response
      .status(400)
      .json({ error: 'nombre, cedula, placa, marca y modelo son requeridos' });
  }

  try {
    // Verificar si la placa ya está registrada
    const carExists = await Car.findOne({ placa: placa.toUpperCase() });
    if (carExists) {
      return response
        .status(400)
        .json({ error: 'Ya existe un auto registrado con esa placa' });
    }

    // Buscar si el cliente ya existe por cedula; si no existe, se crea
    let cliente = await User.findOne({ cedula });

    if (!cliente) {
      // Verificar que el correo no esté en uso por OTRO cliente (cedula distinta)
      if (correo) {
        const correoEnUso = await User.findOne({ email: correo.toLowerCase() });
        if (correoEnUso) {
          return response.status(400).json({
            error: `El correo ${correo} ya está registrado con la cédula ${correoEnUso.cedula}. Verifica los datos del cliente.`,
          });
        }
      }

      cliente = new User({
        name: nombre,
        email: correo,
        telefono,
        cedula,
        rol: 'cliente',
      });

      await cliente.save();
      
    } else {
      // Si ya existia, se actualizan datos de contacto si vinieron nuevos
      let huboCambios = false;
      if (correo && cliente.email !== correo) {
        cliente.email = correo;
        huboCambios = true;
      }
      if (telefono && cliente.telefono !== telefono) {
        cliente.telefono = telefono;
        huboCambios = true;
      }
      if (huboCambios) await cliente.save();
    }

    // Crear el auto con la referencia + snapshot del cliente
    const newCar = new Car({
      placa,
      marca,
      modelo,
      cliente: {
        _id: cliente._id,
        cedula: cliente.cedula,
        nombre: cliente.name,
      },
    });

    await newCar.save();

    return response.status(201).json(newCar);
  } catch (error) {
    console.error('Error registrando el auto:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor al registrar el auto.' });
  }
});

// Listar todos los autos
carsRouter.get('/', async (request, response) => {
  try {
    const cars = await Car.find({});
    return response.status(200).json(cars);
  } catch (error) {
    console.error('Error obteniendo autos:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = carsRouter;