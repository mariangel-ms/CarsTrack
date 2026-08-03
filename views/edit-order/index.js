import { createNotification } from "/components/notification.js";
import { cargarRecibido } from "../components/stages/received/received.js";
import { cargarDiagnostico } from "../components/stages/diagnostic/diagnostic.js";
import { cargarRepuestosPresupuesto,  calcularTotalPresupuesto } from "../components/stages/budget/budget.js";
import { cargarReparacion } from "../components/stages/repair/repair.js";
import { cargarPruebas } from "../components/stages/testing/testing.js";
import { cargarVehiculoListo } from "../components/stages/ready/ready.js";
import { cargarEntregado } from "../components/stages/delivered/delivered.js";
import { cargarFormularioRegistro} from "../components/client-edit/client-edit.js";

const btnVolver = document.querySelector(".btn-volver");
const faseSelect = document.getElementById("fase");
const contenidoFase = document.getElementById("contenido-fase");
const btnGuardar = document.querySelector(".btn-guardar");
const btnEditar = document.querySelector(".btn-editar");
const contenidoEdit = document.querySelector(".contenedor-edit");
const propietarioInfo = document.querySelector(".propietario");
const cedulaInfo = document.querySelector(".cedula");
const correoInfo = document.querySelector(".correo");
const carroInfo = document.querySelector(".carro");
const placaInfo = document.querySelector(".placa");
const costoEstimado = document.querySelector(".costo-valor");

// Variable global para guardar la información de la orden traída de la BD
let ordenActual = {};

// Obtener el ID de la URL
const params = new URLSearchParams(window.location.search);
const ordenId = params.get("id");

//--------------------------------------------------------------------------
const actualizarCostoEstimado = () => {
  const total = calcularTotalPresupuesto(ordenActual.repuestos, ordenActual.mano_obra);
  costoEstimado.textContent = `$${total.toFixed(2)}`;
};

btnVolver.addEventListener("click", () => {
  window.location.href = "/panel/";
});


// Función que inyecta los datos en los inputs basándose en los ID que ya tienen en el HTML
const rellenarInputsAutomaticamente = (fase) => {
    if (fase === "recibido" && ordenActual.recepcion) {
      const inputFecha = document.getElementById("fecha-recepcion");
      const inputKm = document.getElementById("kilometraje");
      const inputCombustible = document.getElementById("nivel-combustible");
      const inputEstado = document.getElementById("estado-vehiculo");

      if (inputFecha)
        inputFecha.value = ordenActual.recepcion.fecha
          ? ordenActual.recepcion.fecha.split("T")[0]
          : "";
      if (inputKm) inputKm.value = ordenActual.recepcion.kilometraje || "";
      if (inputCombustible)
        inputCombustible.value = ordenActual.recepcion.nivel_combustible || "";
      if (inputEstado)
        inputEstado.value = ordenActual.recepcion.estado_general || "";
    }

    if (fase === "diagnostico" && ordenActual.diagnostico) {
      const inputProblema = document.getElementById("problema-reportado");
      const inputDiag = document.getElementById("diagnostico-realizado");
      const inputFechaDiag = document.getElementById("fecha-diagnostico");

      if (inputProblema)
        inputProblema.value = ordenActual.diagnostico.problema_reportado || "";
      if (inputDiag)
        inputDiag.value = ordenActual.diagnostico.diagnostico_realizado || "";
      if (inputFechaDiag)
        inputFechaDiag.value = ordenActual.diagnostico.fecha
          ? ordenActual.diagnostico.fecha.split("T")[0]
          : "";
    }

        if (fase === "pruebas" && ordenActual.pruebas) {
      const inputObservaciones = document.getElementById("observaciones");
      const resultado = document.getElementById("resultado-calidad");

      if (inputObservaciones)
        inputObservaciones.value = ordenActual.pruebas.observaciones || "";
      if (resultado)
        resultado.value = ordenActual.pruebas.resultado || "";
    }


    if (fase === "listo" && ordenActual.listo_entrega) {
      const inputFecha = document.getElementById("fecha-estimada-retiro");
      const inputNota = document.getElementById("notas-listo");

      if (inputNota)
        inputNota.value =  ordenActual.listo_entrega.notas || "";

      if (inputFecha)
       inputFecha.value = ordenActual.listo_entrega.fecha_estimada_retiro
          ? ordenActual.listo_entrega.fecha_estimada_retiro.split("T")[0]
          : "";
    }

       if (fase === "entregado" && ordenActual.entregado) {
      const inputFechaRetirado = document.getElementById("fecha-retirado");

      if (inputFechaRetirado)
      inputFechaRetirado.value = ordenActual.entregado.fecha_retirado
          ? ordenActual.entregado.fecha_retirado.split("T")[0]
          : "";
    }
};


//--------------------------------------------------------------------------
// Función para pintar la fase visualmente
const cambiarFaseVisual = (fase) => {
  contenidoFase.innerHTML = "";

  if (fase === "recibido") {
    cargarRecibido(contenidoFase);
  } else if (fase === "diagnostico") {
    cargarDiagnostico(contenidoFase);
  } else if (fase === "presupuesto") {
cargarRepuestosPresupuesto(
  contenidoFase, 
  ordenActual.repuestos, ordenActual.mano_obra, ordenActual.cliente?.telefono
);
  } else if (fase === "reparacion") {
    cargarReparacion(contenidoFase, ordenActual.reparaciones);
  } else if (fase === "pruebas") {
    cargarPruebas(contenidoFase);
  } else if (fase === "listo") {
    cargarVehiculoListo(contenidoFase);
  } else if (fase === "entregado") {
    cargarEntregado(contenidoFase);
  }

  // Llamamos a la función que rellena los inputs automáticamente
  rellenarInputsAutomaticamente(fase);
  actualizarCostoEstimado()
};


//--------------------------------------------------------------------------
// Evento cuando cambias de fase manualmente en el select
faseSelect.addEventListener("change", () => {
  cambiarFaseVisual(faseSelect.value);
});


//--------------------------------------------------------------------------
// Cargar los datos iniciales al entrar a la página
const cargarOrdenInicial = async () => {
  if (!ordenId) {
    createNotification(true, "No se encontró el id de la orden en la URL.");
    return;
  }

  try {
    const response = await axios.get(`/api/orders/${ordenId}`, {
      withCredentials: true,
    });
    ordenActual = response.data; // Se guardan los datos

    const faseActual = (
   ordenActual.fase ||ordenActual.estado).toLowerCase();
    faseSelect.value = faseActual;

    // Se Pinta la fase, y se llenan los inputs solitos
    cambiarFaseVisual(faseActual);
      actualizarCostoEstimado()

    console.log(ordenActual);

    //Cargar el header
    propietarioInfo.innerHTML = `<span>Propietario: <strong>${ordenActual.cliente.name}</strong></span>`;
    correoInfo.innerHTML = `<span>Correo: <strong>${ordenActual.cliente.email}</strong></span>`;
    cedulaInfo.innerHTML = `<span>Cedula: <strong>${ordenActual.cliente.cedula}</strong></span>`;
    carroInfo.innerHTML = `${ordenActual.vehiculo.marca} ${ordenActual.vehiculo.modelo} `;
    placaInfo.innerHTML = `${ordenActual.vehiculo.placa}`;
  } catch (error) {
    console.error("Error al cargar la orden:", error);
    createNotification(true, "No se pudo cargar la información de la orden.");
  }
};
//--------------------------------------------------------------------------

// Ejecutar al iniciar
cargarOrdenInicial();

// Botón para guardar cambios de las fases de la orden. ESTO ES LO QUE MANDA TODO A LA BASE DE DATOS
btnGuardar.addEventListener("click", async () => {
  if (!ordenId) {
    console.log("No se encontró el id de la orden en la URL.");
    return;
  }

  const fase = faseSelect.value;

  const datos = { fase };
  contenidoFase.querySelectorAll("input, select, textarea").forEach((campo) => {
    if (campo.id) datos[campo.id] = campo.value;
  });

if (fase === "presupuesto") {
    const repuestos = [];
    contenidoFase.querySelectorAll("#lista-repuestos-items .tabla-fila").forEach((fila) => {
      const spans = fila.querySelectorAll("span");
      
      if (spans.length >= 3) {
        repuestos.push({
          nombre: spans[0].textContent,
          cantidad: spans[1].textContent,
          precio: spans[2].textContent.replace('$', '')
        });
      }
    });
    datos.repuestos = repuestos;
    
    const inputManoObra = document.getElementById("costo-mano-obra");
      const manoObra = Number(inputManoObra.value) || 0;
      datos.mano_obra = manoObra;

datos.costo_total = calcularTotalPresupuesto(repuestos, manoObra)
  }

if (fase === "reparacion") {
    const reparaciones = [];
    
    // Opcional: Imprime en consola para ver cuántas filas encuentra el DOM
    const filas = contenidoFase.querySelectorAll(".reparacion-item");

    filas.forEach((fila) => {
      const descripcion = fila.querySelector(".reparacion-texto").textContent;
      const estado = fila.querySelector(".select-estado-reparacion").value;
      reparaciones.push({ descripcion, estado });
    });

    datos.reparaciones = reparaciones;
  }

  try {
    await axios.put(`/api/orders/${ordenId}`, datos, { withCredentials: true });
    createNotification(false, "Cambios guardados exitosamente.");
    window.location.reload();
  } catch (error) {
    const errorMsg =
      error.response.data.error || "Error al guardar los cambios.";
    createNotification(true, errorMsg);
  }
});
//--------------------------------------------------------------------------

// BOTÓN DE EDITAR LOS DATOS DEL CLIENTE Y DEL AUTO
btnEditar.addEventListener("click", async () => {
  try {
    const response = await axios.get(`/api/orders/${ordenId}`, {
      withCredentials: true,
    });

    const clienteCompleto = response.data.cliente;
    const vehiculoId = response.data.vehiculo._id;

    const datosCompletos = {
      ...response.data,
      cliente: clienteCompleto,
    };

    // Inyectamos el formulario en el DOM
    cargarFormularioRegistro(contenidoEdit, datosCompletos);

    const btnVolverEdit = contenidoEdit.querySelector(".btn-volver-edit");
    btnVolverEdit?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/edit-order/?id=${ordenId}`;
    });

    // BOTÓN DE GUARDAR CAMBIOS, PARA ACTUALIZAR LOS DATOS DEL VEHICULO O CLIENTE
    const formEdit = contenidoEdit.querySelector("#form-registro");

    if (formEdit) {
      formEdit.onsubmit = async (e) => {
        e.preventDefault();

        try {
          const actualizacionDatos = {
            nombre: formEdit.querySelector("#nombre-input").value,
            cedula: formEdit.querySelector("#cedula-input").value,
            correo: formEdit.querySelector("#correo-input").value,
            telefono: formEdit.querySelector("#telefono-input").value,
            placa: formEdit.querySelector("#placa-input").value,
            marca: formEdit.querySelector("#marca-input").value,
            modelo: formEdit.querySelector("#modelo-input").value,
            mecanico: formEdit.querySelector("#mecanico-input").value,
          };

          await axios.patch(`/api/cars/${vehiculoId}`, actualizacionDatos, {
            withCredentials: true,
          });
          createNotification(false, "Datos actualizados exitosamente.");
          window.location.href = `/edit-order/?id=${ordenId}`;
        } catch (error) {
          console.log(error);
          const errorMsg =
            error.response.data.error || "Error al actualizar los datos.";
          createNotification(true, errorMsg);
        }
      };
    }
  } catch (error) {
    console.error("Error en el evento click:", error);
    createNotification(true, "No se pudo cargar la información para editar.");
  }
});
//--------------------------------------------------------------------------
