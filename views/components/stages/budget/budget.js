export function cargarRepuestosPresupuesto(contenedor, repuestosExistentes, manoObraExistente) {
  contenedor.innerHTML = `
    <section class="fase-componente presupuesto-componente">
      <div class="componente-header">
        <div>
          <span class="componente-etiqueta">FASE 03</span>
          <h2>Repuestos y presupuesto</h2>
          <p>Agrega los repuestos necesarios y define los costos asociados a la reparación.</p>
        </div>
        <div class="componente-icono">03</div>
      </div>
      <div class="presupuesto-formulario">
        <div class="campo-grupo">
          <label for="nombre-repuesto">Repuesto</label>
          <input type="text" id="nombre-repuesto" placeholder="Ej. Filtro de aceite">
        </div>
        <div class="campo-grupo">
          <label for="cantidad-repuesto">Cantidad</label>
          <input type="number" id="cantidad-repuesto" min="1" value="1">
        </div>
        <div class="campo-grupo">
          <label for="precio-repuesto">Precio unitario</label>
          <div class="input-moneda">
            <span>$</span>
            <input type="number" id="precio-repuesto" min="0" placeholder="0.00">
          </div>
        </div>
        <button type="button" class="btn-agregar-repuesto" id="btn-agregar-repuesto">
          <span>+</span>
          Agregar repuesto
        </button>
      </div>
      <div class="lista-repuestos">
        <div class="lista-repuestos-header">
          <div>
            <h3>Repuestos agregados</h3>
            <p>Estos son los repuestos incluidos en el presupuesto.</p>
          </div>
          <span class="contador-repuestos" id="contador-repuestos">0 repuestos</span>
        </div>
        <div class="tabla-repuestos">
          <div class="tabla-vacia" id="tabla-vacia">
            <div class="tabla-vacia-icono">+</div>
            <h4>Aún no hay repuestos agregados</h4>
            <p>Utiliza el formulario superior para agregar los repuestos necesarios.</p>
          </div>
          <div class="tabla-contenido hidden" id="tabla-contenido">
            <div class="tabla-fila tabla-encabezado">
              <span>Repuesto</span>
              <span>Cantidad</span>
              <span>Precio unitario</span>
              <span>Total</span>
              <span></span>
            </div>
            <div id="lista-repuestos-items"></div>
          </div>
        </div>
      </div>

      <div class="mano-obra-bloque">
        <div class="mano-obra-info">
          <h3>Mano de obra</h3>
          <p>Define el costo de la mano de obra para esta reparación.</p>
        </div>
        <div class="input-moneda input-mano-obra">
          <span>$</span>
          <input type="number" id="costo-mano-obra" min="0" value="0">
        </div>
      </div>
      <div class="presupuesto-resumen">
        <div class="resumen-info">
          <span class="resumen-label">Resumen del presupuesto</span>
          <p>Calcula el costo estimado de los repuestos y la mano de obra.</p>
        </div>
        <div class="resumen-costos">
          <div class="costo-linea">
            <span>Repuestos</span>
            <strong id="subtotal-repuestos">$0.00</strong>
          </div>
          <div class="costo-linea">
            <span>Mano de obra</span>
            <strong id="subtotal-mano-obra">$0.00</strong>
          </div>
          <div class="costo-separador"></div>
          <div class="costo-total">
            <span>Total estimado</span>
            <strong id="total-presupuesto">$0.00</strong>
          </div>
        </div>
      </div>

      <div class="presupuesto-acciones">
        <button type="button" class="btn-enviar-presupuesto" id="btn-enviar-presupuesto">
          Enviar presupuesto
        </button>
      </div>
    </section>
  `;

  // 1. Array para guardar los repuestos (empieza vacio, o con lo que ya tenia la orden)
  const repuestos = [];

  // 2. Capturar elementos del DOM
  const inputNombre = contenedor.querySelector("#nombre-repuesto");
  const inputCantidad = contenedor.querySelector("#cantidad-repuesto");
  const inputPrecio = contenedor.querySelector("#precio-repuesto");
  const btnAgregar = contenedor.querySelector("#btn-agregar-repuesto");
  const listaItems = contenedor.querySelector("#lista-repuestos-items");
  const tablaVacia = contenedor.querySelector("#tabla-vacia");
  const tablaContenido = contenedor.querySelector("#tabla-contenido");
  const contadorRepuestos = contenedor.querySelector("#contador-repuestos");

  // Elementos del resumen (parte de abajo)
  const inputManoObra = contenedor.querySelector("#costo-mano-obra");
  const subtotalRepuestosEl = contenedor.querySelector("#subtotal-repuestos");
  const subtotalManoObraEl = contenedor.querySelector("#subtotal-mano-obra");
  const totalPresupuestoEl = contenedor.querySelector("#total-presupuesto");

  // Recalcula subtotal de repuestos + mano de obra + total, y actualiza los textos
  const actualizarResumen = () => {
    let subtotalRepuestos = 0;

    for (let i = 0; i < repuestos.length; i++) {
      const cantidad = Number(repuestos[i].cantidad);
      const precio = Number(repuestos[i].precio);
      subtotalRepuestos = subtotalRepuestos + (cantidad * precio);
    }

    const manoObra = Number(inputManoObra.value) || 0;
    const total = subtotalRepuestos + manoObra;

    subtotalRepuestosEl.textContent = `$${subtotalRepuestos.toFixed(2)}`;
    subtotalManoObraEl.textContent = `$${manoObra.toFixed(2)}`;
    totalPresupuestoEl.textContent = `$${total.toFixed(2)}`;
  };

  // Dibuja una sola fila en la tabla (se usa tanto al agregar como al precargar)
  const pintarFila = (repuesto) => {
    const totalFila = repuesto.cantidad * repuesto.precio;

    const fila = document.createElement("div");
    fila.className = "tabla-fila";
    fila.innerHTML = `
      <span>${repuesto.nombre}</span>
      <span>${repuesto.cantidad}</span>
      <span>$${repuesto.precio}</span>
      <span>$${totalFila}</span>
      <span><button type="button" class="btn-eliminar-item">X</button></span>
    `;

    listaItems.appendChild(fila);
  };

  // Muestra u oculta la tabla vacia, y actualiza el contador
  const actualizarVisibilidadTabla = () => {
    contadorRepuestos.textContent = `${repuestos.length} repuestos`;

    if (repuestos.length === 0) {
      tablaVacia.classList.remove("hidden");
      tablaContenido.classList.add("hidden");
    } else {
      tablaVacia.classList.add("hidden");
      tablaContenido.classList.remove("hidden");
    }
  };

  // Si la orden ya traia repuestos guardados, los cargamos de una vez,
  // usando la MISMA funcion pintarFila que usa el boton de agregar
  if (repuestosExistentes && repuestosExistentes.length > 0) {
    for (let i = 0; i < repuestosExistentes.length; i++) {
      repuestos.push(repuestosExistentes[i]);
      pintarFila(repuestosExistentes[i]);
    }
    actualizarVisibilidadTabla();
  }

  // Si la orden ya tenia mano de obra guardada, la ponemos en el input
  if (manoObraExistente) {
    inputManoObra.value = manoObraExistente;
  }

  // Pintamos el resumen con lo que ya haya (existente o vacio)
  actualizarResumen();

  // Cada vez que cambies la mano de obra, se recalcula el total en vivo
  inputManoObra.addEventListener("input", actualizarResumen);

  // 3. Evento del botón agregar
btnAgregar.addEventListener("click", () => {
    const nombre = inputNombre.value;
    const cantidad = inputCantidad.value;
    const precio = inputPrecio.value;

    if (nombre === "" || cantidad === "" || precio === "") return;

    const nuevoRepuesto = { nombre, cantidad, precio };
    repuestos.push(nuevoRepuesto);

    pintarFila(nuevoRepuesto);
    actualizarVisibilidadTabla();
    actualizarResumen();

    inputNombre.value = "";
    inputCantidad.value = "1";
    inputPrecio.value = "";
  });

  
listaItems.addEventListener("click", (e) => {
    if (e.target.closest(".btn-eliminar-item")) {
      const fila = e.target.closest(".tabla-fila");
      if (fila) {
        // La fila esta en la misma posicion que su repuesto en el arreglo,
        // porque siempre las agregamos en el mismo orden.
        const filas = Array.from(listaItems.children);
        const index = filas.indexOf(fila);
        repuestos.splice(index, 1);

        fila.remove(); // Borra la fila visualmente
        actualizarVisibilidadTabla();
        actualizarResumen();
      }
    }
  });
}

// Función global para calcular el total de cualquier orden/repuestos
export function calcularTotalPresupuesto(repuestos = [], manoObra = 0) {
  let subtotalRepuestos = 0;

  for (let i = 0; i < repuestos.length; i++) {
    const cantidad = Number(repuestos[i].cantidad);
    const precio = Number(repuestos[i].precio);
    subtotalRepuestos += cantidad * precio;
  }

  const manoObraNum = Number(manoObra) || 0;
  return subtotalRepuestos + manoObraNum;
}