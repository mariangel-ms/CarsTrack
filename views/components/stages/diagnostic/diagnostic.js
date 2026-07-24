export function cargarDiagnostico(contenedor) {
  contenedor.innerHTML = `
    <section class="fase-componente diagnostico-componente">
      <div class="componente-header">
        <div>
          <span class="componente-etiqueta">FASE 02</span>
          <h2>Diagnóstico</h2>
          <p>Registra las fallas encontradas y el diagnóstico realizado al vehículo.</p>
        </div>

        <div class="componente-icono">02</div>
      </div>

      <div class="formulario-fase">
        <div class="campo-grupo campo-completo">
          <label for="problema-reportado">Problema reportado por el cliente</label>
          <textarea id="problema-reportado" placeholder="Describe el problema indicado por el propietario..."></textarea>
        </div>

        <div class="campo-grupo campo-completo">
          <label for="diagnostico-realizado">Diagnóstico realizado</label>
          <textarea id="diagnostico-realizado" placeholder="Describe las pruebas realizadas y el diagnóstico obtenido..."></textarea>
        </div>

        <div class="campo-grupo">
          <label for="fecha-diagnostico">Fecha del diagnóstico</label>
          <input type="date" id="fecha-diagnostico">
        </div>

      </div>
    </section>
  `;
}