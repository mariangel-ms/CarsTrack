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

btnVolver.addEventListener("click", () => {
  window.location.pathname = "/panel/";
});

faseSelect.addEventListener("change", () => {
  const fase = faseSelect.value;

  if (fase === "recibido") {
    cargarRecibido(contenidoFase);
  }

  if (fase === "diagnostico") {
    cargarDiagnostico(contenidoFase);
  }

  if (fase === "presupuesto") {
    cargarRepuestosPresupuesto(contenidoFase);
  }

  if (fase === "reparacion") {
    cargarReparacion(contenidoFase);
  }

  if (fase === "pruebas") {
    cargarPruebas(contenidoFase);
  }

    if (fase === "listo") {
    cargarVehiculoListo(contenidoFase);
  }

      if (fase === "entregado") {
    cargarEntregado(contenidoFase);
  }
});

//------------------esto es para guardar los cambios en la base de datos------------------------

const params = new URLSearchParams(window.location.search);
const ordenId = params.get('id');
 
 
btnGuardar?.addEventListener('click', async () => {
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