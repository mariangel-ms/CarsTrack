export function cargarVehiculoListo(contenedor) {
 contenedor.innerHTML = `
    <section class="fase-componente listo-componente">
      <div class="componente-header">
        <div>
          <span class="componente-etiqueta">FASE 06</span>
          <h2>Vehiculo listo</h2>
          <p>El vehículo aprobó todas las pruebas y está listo para que el cliente lo retire.</p>
        </div>
        <div class="componente-icono">06</div>
      </div>
 
 
      <div class="formulario-fase">
        <div class="campo-grupo">
          <label for="fecha-estimada-retiro">Fecha estimada de retiro</label>
          <input type="date" id="fecha-estimada-retiro">
        </div>
 
        <div class="campo-grupo campo-completo">
          <label for="notas-listo">Notas para el cliente</label>
          <textarea id="notas-listo" placeholder="Ej. Recordar traer la cédula al momento de retirar el vehículo..."></textarea>
        </div>
      </div>
 
      <div class="listo-acciones">
        <button type="button" class="btn-notificar-cliente" id="btn-notificar-cliente">
          Notificar al cliente
        </button>
      </div>
    </section>
  `;
}