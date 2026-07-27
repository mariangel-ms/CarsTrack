export function cargarReparacion(contenedor) {
  contenedor.innerHTML = `
    <section class="fase-componente reparacion-componente">
      <div class="componente-header">
        <div>
          <span class="componente-etiqueta">FASE 04</span>
          <h2>Reparación</h2>
          <p>Registra las reparaciones que se le harán al vehículo y actualiza su estado a medida que el mecánico las finalice.</p>
        </div>
        <div class="componente-icono">04</div>
      </div>

      <div class="reparacion-formulario">
        <div class="campo-grupo campo-completo">
          <label for="nueva-reparacion">Reparación a realizar</label>
          <input type="text" id="nueva-reparacion" placeholder="Ej. Cambio de pastillas de freno delanteras">
        </div>
        <button type="button" class="btn-agregar-reparacion" id="btn-agregar-reparacion">
          <span>+</span>
          Agregar reparación
        </button>
      </div>

      <div class="lista-reparaciones">
        <div class="lista-reparaciones-header">
          <div>
            <h3>Reparaciones registradas</h3>
            <p>Marca cada reparación como "Lista" cuando el mecánico la finalice.</p>
          </div>
          <span class="contador-reparaciones" id="contador-reparaciones">2 reparaciones</span>
        </div>

        <div class="reparaciones-vacia hidden" id="reparaciones-vacia">
          <div class="reparaciones-vacia-icono">🔧</div>
          <h4>Aún no hay reparaciones agregadas</h4>
          <p>Utiliza el campo superior para registrar la primera reparación.</p>
        </div>

        <div class="reparaciones-items" id="reparaciones-items">
          <div class="reparacion-item">
            <span class="reparacion-texto">Cambio de pastillas de freno delanteras</span>
            <div class="reparacion-acciones">
              <select class="input-select select-estado-reparacion">
                <option value="pendiente" selected>Pendiente</option>
                <option value="lista">Lista</option>
              </select>
              <button type="button" class="btn-eliminar-reparacion">×</button>
            </div>
          </div>
          <div class="reparacion-item">
            <span class="reparacion-texto">Cambio de bujías de iridium</span>
            <div class="reparacion-acciones">
              <select class="input-select select-estado-reparacion">
                <option value="pendiente">Pendiente</option>
                <option value="lista" selected>Lista</option>
              </select>
              <button type="button" class="btn-eliminar-reparacion">×</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}