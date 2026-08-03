import { createNotification } from "/components/notification.js";

export function cargarConfirmarBorrar(idOrden, presupuestoAprobado = false) {
  const confirmacion = document.createElement("div");

 confirmacion.className = "modal-overlay";

  confirmacion.innerHTML = `
    <div class="modal-contenido">
      
      <h2>
        ${presupuestoAprobado == "aprobado"
          ? "¿Cancelar orden?"
          : "¿Eliminar orden?"
        }
      </h2>

      <p>
        ${
          presupuestoAprobado == "aprobado"
            ? "El presupuesto de esta orden ya fue aprobado y el vehiculo se encuentra en reparacion. Si la eliminas, la orden quedará registrada como cancelada. Esta acción no se puede deshacer."
            : "¿Estás seguro de que quieres eliminar esta orden? Esta acción no se puede deshacer."
        }
      </p>

      <div class="modal-botones">

        <button type="button" id="btn-volver">
          Volver
        </button>

        <button type="button" id="btn-confirmar">
          ${
           presupuestoAprobado == "aprobado"
              ? "Cancelar orden"
              : "Eliminar"
          }
        </button>

      </div>

    </div>
  `;

    const btnVolver = confirmacion.querySelector("#btn-volver");
    const btnConfirmar = confirmacion.querySelector("#btn-confirmar");



  document.body.appendChild(confirmacion);

  //------boton volver------
  btnVolver.addEventListener("click", () => {
    confirmacion.remove();
  });

  //-------boton confirmar-------
  btnConfirmar.addEventListener("click", async () => {
    try {
      await eliminarOrden(idOrden);
      confirmacion.remove();

      createNotification(false,"Orden eliminada exitosamente.");

      setTimeout(() => {
        location.reload();
      }, 1500);
      
    } catch (error) {

      console.error(
        "Error al eliminar la orden:",error );
    }
  });
}

async function eliminarOrden(idOrden) {
  try {
    const respuesta = await axios.delete(
      `/api/orders/${idOrden}`,
      {
        withCredentials: true
      }
    );
  } catch (error) {
    console.error("ERROR:", error);
  }

}