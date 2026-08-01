export function cargarPruebas(contenedor) {
  contenedor.innerHTML = `
    <section class="fase-componente calidad-componente">
      <div class="componente-header">
        <div>
          <span class="componente-etiqueta">FASE 05</span>
          <h2>Control de calidad</h2>
          <p>Verifica que el vehículo pase las pruebas finales antes de entregarlo al cliente.</p>
        </div>
        <div class="componente-icono">05</div>
      </div>


<div class="formulario-fase">
  <div class="campo-grupo campo-completo">
    <label for="observaciones">Observaciones del control de calidad</label>
    <textarea id="observaciones" placeholder="Describe cualquier hallazgo durante las pruebas finales..."></textarea>
  </div>
</div>

        <div class="campo-grupo campo-completo">
          <label for="resultado-calidad">Resultado del control de calidad</label>
          <select id="resultado-calidad">
            <option value="">Seleccionar resultado</option>
            <option value="aprobado">Aprobado, listo para entrega</option>
            <option value="revision">Requiere revisión adicional</option>
          </select>
        </div>
      </div>
    </section>
  `;
}