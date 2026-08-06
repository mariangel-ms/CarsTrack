import { createNotification } from "/components/notification.js";

export function cargarNotificacionPresupuesto() {
  const confirmacion = document.createElement("div");
  confirmacion.className = "modal-overlay activo";
  confirmacion.innerHTML = `
    <div class="modal-contenido">
      
      <h2>¿Acepta la reparación?</h2>
      <span class="subtitulo-accion">Accion requerida</span>

      <div class="modal-checkbox-container">
        <label class="custom-checkbox-label">
          <input type="checkbox" id="check-repuestos" checked />
          <span class="checkmark"></span>
          <span class="checkbox-text">El taller suministra los repuestos (Garantía incluida)</span>
        </label>
      </div>

      <p class="modal-nota">
        (En caso de rechazar los repuestos presupuestados por el taller, el propietario debe suministrarlos en un lapso de 7 días.)
      </p>

      <div class="modal-botones">
        <button type="button" id="btn-confirmar" class="btn-primario">
          Autorizar
        </button>
        <button type="button" id="btn-rechazar" class="btn-secundario">
          Rechazar
        </button>
      </div>

    </div>
  `;

  const btnRechazar = confirmacion.querySelector("#btn-rechazar");
  const btnConfirmar = confirmacion.querySelector("#btn-confirmar");
  const checkRepuestos = confirmacion.querySelector("#check-repuestos");

  // Acción al rechazar
  btnRechazar.addEventListener("click", async () => {
    try {
      await axios.patch("/api/orders/mine/update", { 
        aprobacion_reparacion: "rechazado",
        presupuesto_enviado: false 
      }, { withCredentials: true });

      createNotification(true, "Has rechazado el presupuesto de la orden.");
      confirmacion.remove();
      window.location.reload();
    } catch (error) {
      console.error(error);
      createNotification(true, "Error al enviar la respuesta.");
    }
  });

  // Acción al autorizar
  btnConfirmar.addEventListener("click", async () => {
    try {
      const aceptaRepuestosDelTaller = checkRepuestos.checked;

      await axios.patch("/api/orders/mine/update", { 
        aprobacion_reparacion: "aprobado",
        presupuesto_enviado: false,
        acepta_repuestos: aceptaRepuestosDelTaller
      }, { withCredentials: true });

      createNotification(false, "¡Presupuesto autorizado con éxito!");
      confirmacion.remove();
      window.location.reload();
    } catch (error) {
      console.error("Error al procesar la respuesta:", error);
      createNotification(true, "Hubo un error al procesar tu respuesta.");
    }
  });

  document.body.appendChild(confirmacion);
}