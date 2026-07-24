export function cargarRecibido(contenedor) {
  contenedor.innerHTML = `
    <section class="fase-componente recibido-componente">
      <div class="componente-header">
        <div>
          <span class="componente-etiqueta">FASE 01</span>
          <h2>Vehículo recibido</h2>
          <p>Registra las condiciones del vehículo al momento de ingresar al taller.</p>
        </div>
        <div class="componente-icono">01</div>
      </div>

      <div class="formulario-fase">
        <div class="campo-grupo">
          <label for="fecha-recepcion">Fecha de recepción</label>
          <input type="date" id="fecha-recepcion">
        </div>

        <div class="campo-grupo">
          <label for="kilometraje">Kilometraje</label>
          <div class="input-con-sufijo">
            <input type="number" id="kilometraje" placeholder="Ej. 85000">
            <span>km</span>
          </div>
        </div>

        <div class="campo-grupo">
          <label for="nivel-combustible">Nivel de combustible</label>
          <select id="nivel-combustible">
            <option value="">Seleccionar nivel</option>
            <option value="vacio">Vacío</option>
            <option value="cuarto">1/4</option>
            <option value="medio">1/2</option>
            <option value="tres-cuartos">3/4</option>
            <option value="lleno">Lleno</option>
          </select>
        </div>

        <div class="campo-grupo campo-completo">
          <label for="estado-vehiculo">Estado general del vehículo</label>
          <textarea id="estado-vehiculo" placeholder="Describe las condiciones generales en las que se recibe el vehículo..."></textarea>
    
      </div>
    </section>
  `;
}