export function cargarRepuestosPresupuesto(contenedor) {
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
      <div class="aprobacion-presupuesto">
        <div>
          <h3>Estado del presupuesto</h3>
          <p>Indica si el cliente ha aprobado el presupuesto para continuar con la reparación.</p>
        </div>
        <select id="estado-presupuesto">
          <option value="">Seleccionar estado</option>
          <option value="pendiente">Pendiente de aprobación</option>
          <option value="aprobado">Aprobado por el cliente</option>
          <option value="rechazado">Rechazado por el cliente</option>
        </select>
      </div>

      <div class="presupuesto-acciones">
        <button type="button" class="btn-enviar-presupuesto" id="btn-enviar-presupuesto">
          Enviar presupuesto
        </button>
      </div>
    </section>
  `;}