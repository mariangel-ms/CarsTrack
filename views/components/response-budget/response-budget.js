import { createNotification } from "/components/notification.js";

export function cargarNotificacionPresupuesto() {
  const confirmacion = document.createElement("div");
  confirmacion.className = "modal-presupuesto-overlay activo";
  confirmacion.innerHTML = `
    <div class="modal-presupuesto-card">

      <button type="button" id="btn-cerrar-modal" class="modal-presupuesto-cerrar">&times;</button>
      <h2>¿Acepta la reparación?</h2>
      <span class="modal-presupuesto-subtitulo">Accion requerida</span>

      <div class="modal-presupuesto-checkbox-wrapper">
        <label class="modal-presupuesto-label">
          <input type="checkbox" id="check-repuestos" checked />
          <span class="modal-presupuesto-text">El taller suministra los repuestos (Garantía incluida)</span>
        </label>
      </div>

      <p class="modal-presupuesto-nota">
        (En caso de rechazar los repuestos presupuestados por el taller, el propietario debe suministrarlos en un lapso de 7 días.)
      </p>

      <div class="modal-presupuesto-acciones">
        <button type="button" id="btn-confirmar" class="btn-autorizar">
          Autorizar
        </button>
        <button type="button" id="btn-rechazar" class="btn-rechazar-presupuesto">
          Rechazar
        </button>
      </div>

    </div>
  `;

  const btnRechazar = confirmacion.querySelector("#btn-rechazar");
  const btnConfirmar = confirmacion.querySelector("#btn-confirmar");
  const checkRepuestos = confirmacion.querySelector("#check-repuestos");
  const btnCerrar = confirmacion.querySelector("#btn-cerrar-modal");

  // Acción al rechazar
  btnRechazar.addEventListener("click", async () => {
    try {
      await axios.patch("/api/orders/mine/update", { 
        aprobacion_reparacion: "Rechazado",
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
        aprobacion_reparacion: "Aprobado",
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

// Acción para cerrar
  btnCerrar.addEventListener("click", () => {
    confirmacion.remove();
  });

  document.body.appendChild(confirmacion);
}