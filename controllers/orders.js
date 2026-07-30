const ordersRouter = require('express').Router();
const Order = require('../models/order');
const User = require('../models/user');

ordersRouter.get('/:id', async (request, response) => {
  try {
    const orden = await Order.findById(request.params.id);
    console.log(orden)
const cliente = await User.findById(orden.cliente._id);

const ordenConCliente = {
      ...orden._doc,
      cliente: cliente // Sobrescribe la propiedad cliente con el objeto completo
    };

    return response.status(200).json(ordenConCliente);
  } catch (error) {
    console.error('Error al buscar la orden:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor.' });
  }
});


// Actualiza una orden segun la fase que se esta guardando
ordersRouter.put('/:id', async (request, response) => {
  const { fase, ...datos } = request.body;

  try {
    const orden = await Order.findById(request.params.id);

    if (!orden) {
      return response.status(404).json({ error: 'Orden no encontrada' });
    }

    if (fase === 'recibido') {
      orden.estado = 'Recibido';
      orden.recepcion = {
        fecha: datos['fecha-recepcion'],
        kilometraje: Number(datos['kilometraje']),
        nivel_combustible: datos['nivel-combustible'],
        estado_general: datos['estado-vehiculo'],
      };
    }

        if (fase === 'diagnostico') {
      orden.estado = 'Diagnostico';
      orden.diagnostico = {
         problema_reportado:datos["problema-reportado"],
         diagnostico_realizado:datos["diagnostico-realizado"],
           fecha: datos["fecha-diagnostico"]
      };
    }
    
     if (fase === 'presupuesto') {
      orden.estado = 'Presupuesto';
      // Si el frontend envía los repuestos y la mano de obra, los guardamos
      if (datos.repuestos) {
        orden.repuestos = datos.repuestos;
      }
      if (datos.mano_obra !== undefined) {
        orden.mano_obra = Number(datos.mano_obra);
      }
    }

    await orden.save();

    return response.status(200).json(orden);
  } catch (error) {
    console.error('Error actualizando la orden:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor al actualizar la orden.' });
  }
});

// Elimina una orden por su _id
ordersRouter.delete('/:id', async (request, response) => {

  try {
    const orden = await Order.findByIdAndDelete(request.params.id);
 
    if (!orden) {
      return response.status(404).json({ error: 'Orden no encontrada' });
    }
 
    return response.status(204).end();
  } catch (error) {
    console.error('Error eliminando la orden:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor al eliminar la orden.' });
  }
});

ordersRouter.post('/:id', async (request, response) => {
  try {
    const { nombre, cantidad, precio } = request.body;
    
    // Buscar la orden y agregar el repuesto al array correspondiente
    const orden = await Order.findById(request.params.id);
    if (!orden) return response.status(404).json({ error: "Orden no encontrada" });

    orden.repuestos.push({ nombre, cantidad, precio });
    await orden.save();

    response.json(orden);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Error al guardar el repuesto" });
  }
});

module.exports = ordersRouter;