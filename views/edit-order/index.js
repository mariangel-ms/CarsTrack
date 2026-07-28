import { createNotification } from "/components/notification.js";
import { cargarRecibido } from "../components/stages/received/received.js";
import { cargarDiagnostico } from "../components/stages/diagnostic/diagnostic.js";
import { cargarRepuestosPresupuesto } from "../components/stages/budget/budget.js";
import { cargarReparacion } from "../components/stages/repair/repair.js";
import { cargarPruebas } from "../components/stages/testing/testing.js";
import { cargarVehiculoListo } from "../components/stages/ready/ready.js";
import { cargarEntregado } from "../components/stages/delivered/delivered.js";

const btnVolver = document.querySelector(".btn-volver");
const faseSelect = document.getElementById("fase");
const contenidoFase = document.getElementById("contenido-fase");
const btnGuardar = document.querySelector('.btn-guardar');

// Variable global para guardar la información de la orden traída de la BD
let ordenActual = {};

btnVolver.addEventListener("click", () => {
  window.location.href = "/panel/";
});

// Función que inyecta los datos en los inputs basándose en los ID que ya tienen en el HTML
const rellenarInputsAutomaticamente = (fase) => {
  setTimeout(() => {
    if (fase === 'recibido' && ordenActual.recepcion) {
      const inputFecha = document.getElementById('fecha-recepcion');
      const inputKm = document.getElementById('kilometraje');
      const inputCombustible = document.getElementById('nivel-combustible');
      const inputEstado = document.getElementById('estado-vehiculo');

      if (inputFecha) inputFecha.value = ordenActual.recepcion.fecha ? ordenActual.recepcion.fecha.split('T')[0] : '';
      if (inputKm) inputKm.value = ordenActual.recepcion.kilometraje || '';
      if (inputCombustible) inputCombustible.value = ordenActual.recepcion.nivel_combustible || '';
      if (inputEstado) inputEstado.value = ordenActual.recepcion.estado_general || '';
    } 
    
    if (fase === 'diagnostico' && ordenActual.diagnostico) {
      const inputProblema = document.getElementById('problema-reportado');
      const inputDiag = document.getElementById('diagnostico-realizado');
      const inputFechaDiag = document.getElementById('fecha-diagnostico');

      if (inputProblema) inputProblema.value = ordenActual.diagnostico.problema_reportado || '';
      if (inputDiag) inputDiag.value = ordenActual.diagnostico.diagnostico_realizado || '';
      if (inputFechaDiag) inputFechaDiag.value = ordenActual.diagnostico.fecha ? ordenActual.diagnostico.fecha.split('T')[0] : '';
    }
  }, 50);
};

// Función para pintar la fase visualmente
const cambiarFaseVisual = (fase) => {
  contenidoFase.innerHTML = "";

  if (fase === "recibido") {
    cargarRecibido(contenidoFase);
  } else if (fase === "diagnostico") {
    cargarDiagnostico(contenidoFase);
  } else if (fase === "presupuesto") {
    cargarRepuestosPresupuesto(contenidoFase);
  } else if (fase === "reparacion") {
    cargarReparacion(contenidoFase);
  } else if (fase === "pruebas") {
    cargarPruebas(contenidoFase);
  } else if (fase === "listo") {
    cargarVehiculoListo(contenidoFase);
  } else if (fase === "entregado") {
    cargarEntregado(contenidoFase);
  }

  // Llamamos a la función que rellena los inputs automáticamente
  rellenarInputsAutomaticamente(fase);
};

// Evento cuando cambias de fase manualmente en el select
faseSelect.addEventListener("change", () => {
  cambiarFaseVisual(faseSelect.value);
});

// Obtener el ID de la URL
const params = new URLSearchParams(window.location.search);
const ordenId = params.get('id');

// Cargar los datos iniciales al entrar a la página (botón editar o recargar)
const cargarOrdenInicial = async () => {
  if (!ordenId) {
    createNotification(true, 'No se encontró el id de la orden en la URL.');
    return;
  }

  try {
    const response = await axios.get(`/api/orders/${ordenId}`, { withCredentials: true });
    ordenActual = response.data; // Se guardan los datos

    const faseActual = (ordenActual.fase || ordenActual.estado || "recibido").toLowerCase();
    faseSelect.value = faseActual;
    
    //sE Pinta la fase, y se llenan los inputs solitos
    cambiarFaseVisual(faseActual);

  } catch (error) {
    console.error("Error al cargar la orden:", error);
    createNotification(true, "No se pudo cargar la información de la orden.");
  }
};

// Ejecutar al iniciar
cargarOrdenInicial();

// Botón para guardar cambios
btnGuardar.addEventListener('click', async () => {
  if (!ordenId) {
    createNotification(true, 'No se encontró el id de la orden en la URL.');
    return;
  }
 
  const fase = faseSelect.value;
 
  const datos = { fase };
  contenidoFase.querySelectorAll('input, select, textarea').forEach((campo) => {
    if (campo.id) datos[campo.id] = campo.value;
  });
 
  try {
    await axios.put(`/api/orders/${ordenId}`, datos, { withCredentials: true });
    createNotification(false, 'Cambios guardados exitosamente.');
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Error al guardar los cambios.';
    createNotification(true, errorMsg);
  }
});