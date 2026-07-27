const ordersRouter = require('express').Router();
const Order = require('../models/order');

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
        fecha: datos['fecha-recepcion'] || null,
        kilometraje: Number(datos['kilometraje']) || 0,
        nivel_combustible: datos['nivel-combustible'] || '',
        estado_general: datos['estado-vehiculo'] || '',
      };
    }

    // Aqui vamos a ir agregando el resto:
    // if (fase === 'diagnostico') { ... }
    // if (fase === 'presupuesto') { ... }
    // etc.

    await orden.save();

    return response.status(200).json(orden);
  } catch (error) {
    console.error('Error actualizando la orden:', error.message);
    return response.status(500).json({ error: 'Error interno del servidor al actualizar la orden.' });
  }
});

module.exports = ordersRouter;