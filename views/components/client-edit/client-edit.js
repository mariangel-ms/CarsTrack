export function cargarFormularioRegistro(contenedor, datos = {}) {
  const cliente = datos.cliente || {};
  const vehiculo = datos.vehiculo || {};
  const mecanicoSeleccionado = datos.mecanico || '';

  contenedor.innerHTML = `
 <div class="modal-overlay activo" id="modal-edicion">
      <div class="modal-contenido">
        <form id="form-registro" class="formulario-registro">
          <h2>Editar datos</h2>
          
          <div class="grupo-input">
            <label>Cliente</label>
            <input id="nombre-input" type="text" placeholder="Nombre completo" value="${cliente.name || ''}" required />
          </div>

          <div class="grid-inputs-doble">
            <div class="grupo-input">
              <label>Cédula</label>
              <input id="cedula-input" type="text" placeholder="V-12345678" value="${cliente.cedula|| ''}" required />
            </div>
            <div class="grupo-input">
              <label>Teléfono</label>
              <input id="telefono-input" type="tel" placeholder="0412-1234567" value="${cliente.telefono || ''}" required />
            </div>
          </div>

          <div class="grupo-input">
            <label>Correo electrónico</label>
            <input id="correo-input" type="email" placeholder="correo@ejemplo.com" value="${cliente.email || ''}" required />
          </div>

          <div class="grid-inputs-doble">
            <div class="grupo-input">
              <label>Placa</label>
              <input id="placa-input" type="text" placeholder="ABC12D" class="uppercase" value="${vehiculo.placa ||  ''}" required />
            </div>
            <div class="grupo-input">
              <label>Marca</label>
              <input id="marca-input" type="text" placeholder="Chevrolet" value="${vehiculo.marca || ''}" required />
            </div>
          </div>

          <div class="grupo-input">
            <label>Modelo</label>
            <input id="modelo-input" type="text" placeholder="Aveo" value="${vehiculo.modelo|| ''}" required />
          </div>

          <div class="grupo-input">
            <label for="mecanico-input">Mecánico</label>
            <select id="mecanico-input" required>
              <option value="" disabled ${!mecanicoSeleccionado ? 'selected' : ''}>Selecciona...</option>
              <option value="Adolfo Martínez" ${mecanicoSeleccionado === 'Adolfo Martínez' ? 'selected' : ''}>Adolfo Martínez</option>
              <option value="Jesús Sifuentes" ${mecanicoSeleccionado === 'Jesús Sifuentes' ? 'selected' : ''}>Jesús Sifuentes</option>
              <option value="Luisana Martínez" ${mecanicoSeleccionado === 'Luisana Martínez' ? 'selected' : ''}>Luisana Martínez</option>
            </select>
          </div>
          <div class="grupo-botones">
                      <button id="form-btn" type="submit" class="btn-guardar-cambios"> Guardar cambios</button>
                   <button type="button" id="form-btn" class="btn-volver-edit">Volver</button>
           </div>
        </form>
      </div>
    </div>
  `;
}