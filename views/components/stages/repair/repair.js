export function cargarReparacion(contenedor, reparacionesExistentes) {
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
          <span class="contador-reparaciones" id="contador-reparaciones">0 reparaciones</span>
        </div>

        <div class="reparaciones-vacia" id="reparaciones-vacia">
          <div class="reparaciones-vacia-icono">🔧</div>
          <h4>Aún no hay reparaciones agregadas</h4>
          <p>Utiliza el campo superior para registrar la primera reparación.</p>
        </div>

        <div class="reparaciones-items hidden" id="reparaciones-items"></div>
      </div>
    </section>
  `;

  // 1. Array para guardar las reparaciones (empieza vacío o con lo que trae la orden)
  const reparaciones = [];

  // 2. Capturar elementos del DOM
  const inputNuevaReparacion = contenedor.querySelector("#nueva-reparacion");
  const btnAgregar = contenedor.querySelector("#btn-agregar-reparacion");
  const listaItems = contenedor.querySelector("#reparaciones-items");
  const reparacionesVacia = contenedor.querySelector("#reparaciones-vacia");
  const contadorReparaciones = contenedor.querySelector("#contador-reparaciones");

  // Dibuja una sola fila en la lista (se usa tanto al agregar como al precargar)
  const pintarFila = (reparacion) => {
    const fila = document.createElement("div");
    fila.className = "reparacion-item";
    fila.innerHTML = `
      <span class="reparacion-texto">${reparacion.descripcion}</span>
      <div class="reparacion-acciones">
        <select class="input-select select-estado-reparacion">
          <option value="pendiente" ${reparacion.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
          <option value="lista" ${reparacion.estado === "lista" ? "selected" : ""}>Lista</option>
        </select>
        <button type="button" class="btn-eliminar-reparacion">×</button>
      </div>
    `;

    // Sincronizar el cambio de estado en tiempo real dentro del objeto de la fila
    const selectEstado = fila.querySelector(".select-estado-reparacion");
    selectEstado.addEventListener("change", () => {
      reparacion.estado = selectEstado.value;
    });

    listaItems.appendChild(fila);
  };

  // Muestra u oculta el bloque vacío, y actualiza el texto del contador
  const actualizarVisibilidadTabla = () => {
    contadorReparaciones.textContent = `${reparaciones.length} ${reparaciones.length === 1 ? "reparación" : "reparaciones"}`;

    if (reparaciones.length === 0) {
      reparacionesVacia.classList.remove("hidden");
      listaItems.classList.add("hidden");
    } else {
      reparacionesVacia.classList.add("hidden");
      listaItems.classList.remove("hidden");
    }
  };

  // Si la orden ya traía reparaciones guardadas, las cargamos de una vez
  if (reparacionesExistentes && reparacionesExistentes.length > 0) {
    for (let i = 0; i < reparacionesExistentes.length; i++) {
      reparaciones.push(reparacionesExistentes[i]);
      pintarFila(reparacionesExistentes[i]);
    }
    actualizarVisibilidadTabla();
  }

  // 3. Evento del botón agregar
  btnAgregar.addEventListener("click", () => {
    const descripcion = inputNuevaReparacion.value.trim();
    if (descripcion === "") return;

    const nuevaReparacion = {
      descripcion: descripcion,
      estado: "pendiente" // Por defecto nace como pendiente
    };

    reparaciones.push(nuevaReparacion);
    pintarFila(nuevaReparacion);
    actualizarVisibilidadTabla();

    inputNuevaReparacion.value = "";
    inputNuevaReparacion.focus();
  });

  // Permitir agregar también presionando "Enter"
  inputNuevaReparacion.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnAgregar.click();
    }
  });

  // 4. Evento para eliminar una reparación de la lista
  listaItems.addEventListener("click", (e) => {
    if (e.target.closest(".btn-eliminar-reparacion")) {
      const fila = e.target.closest(".reparacion-item");
      if (fila) {
        const filas = Array.from(listaItems.children);
        const index = filas.indexOf(fila);
        
        reparaciones.splice(index, 1);
        fila.remove();
        actualizarVisibilidadTabla();
      }
    }
  });
}