import { createNotification } from "/components/notification.js";

export function cargarConfirmarBorrar(
  idOrden,
  presupuestoAprobado = false,
  tarjeta
) {

  const confirmacion = document.createElement("div");

  confirmacion.className = "modal-overlay";

  confirmacion.innerHTML = `
    <div class="modal-contenido">
      
      <h2>
        ${
          presupuestoAprobado == "aprobado"
            ? "¿Cancelar orden?"
            : "¿Eliminar orden?"
        }
      </h2>

      <p>
        ${
          presupuestoAprobado == "aprobado"
            ? "El presupuesto de esta orden ya fue aprobado y el vehículo se encuentra en reparación. Si la eliminas, la orden quedará registrada como cancelada. Esta acción no se puede deshacer."
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


  // BOTÓN VOLVER

  btnVolver.addEventListener("click", () => {
    confirmacion.remove();
  });


  // BOTÓN CONFIRMAR

  btnConfirmar.addEventListener("click", async () => {

    try {

      await eliminarOrden(idOrden);

      confirmacion.remove();

      tarjeta.remove();

      createNotification(
        false,
        "Orden eliminada exitosamente."
      );

    } catch (error) {

      console.error(
        "Error al eliminar la orden:",
        error
      );

      createNotification(
        true,
        "No se pudo eliminar la orden."
      );

    }

  });

}


async function eliminarOrden(idOrden) {

  const respuesta = await axios.delete(
    `/api/orders/${idOrden}`,
    {
      withCredentials: true
    }
  );

  return respuesta;

}