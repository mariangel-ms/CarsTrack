export function cargarEntregado(contenedor) {
  contenedor.innerHTML = `
    <section class="fase-componente entregado-componente">
      <div class="componente-header">
        <div>
          <span class="componente-etiqueta">FASE 07</span>
          <h2>Entregado</h2>
        </div>
        <div class="componente-icono">07</div>
    </section>


        
      <div class="formulario-fase">
        <div class="campo-grupo">
          <label for="fecha-retirado">Fecha en la que se retiro el vehiculo</label>
          <input type="date" id="fecha-retirado">
        </div>
 
      </div>
  `;
}