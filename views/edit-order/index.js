
import { cargarRecibido } from "../components/stages/received/received.js";
import { cargarDiagnostico } from "../components/stages/diagnostic/diagnostic.js";
import { cargarRepuestosPresupuesto } from "../components/stages/budget/budget.js";

const btnVolver = document.querySelector(".btn-volver")
const faseSelect = document.getElementById("fase");
const contenidoFase = document.getElementById("contenido-fase");

btnVolver.addEventListener("click", () => {
    window.location.pathname = '/panel/';
})

faseSelect.addEventListener("change", () => {
  const fase = faseSelect.value;

  if (fase === "recibido") {
    cargarRecibido(contenidoFase);
  }

  if (fase === "diagnostico") {
    cargarDiagnostico(contenidoFase);
  }

    if (fase === "presupuesto") {
    cargarRepuestosPresupuesto(contenidoFase)
  }
});