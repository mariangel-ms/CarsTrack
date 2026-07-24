import { createNotification } from "/components/notification.js";

const PHONE_REGEX = /^(0414|0424|0412|0416|0426)[0-9]{7}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/;
const CEDULA_REGEX =/^([VEve]-?)?[0-9]{6,8}$/
const PLACA_REGEX = /^[A-Z]{3}[\s-]?[0-9]{2,3}[\s-]?[A-Z0-9]$/
const MARCA_REGEX = /^[A-Z][A-Za-z0-9\s\-\.]{2,29}$/
const MODELO_REGEX = /^[A-Z][A-Za-z0-9\s\-\.\#\+]{2,34}$/

const form = document.querySelector("#form-registro");
const nombreInput = document.querySelector("#nombre-input");
const cedulaInput = document.querySelector("#cedula-input");
const correoInput = document.querySelector("#correo-input");
const telefonoInput = document.querySelector("#telefono-input");
const placaInput = document.querySelector("#placa-input");
const marcaInput = document.querySelector("#marca-input");
const modeloInput = document.querySelector("#modelo-input");
const mecanicoInput = document.querySelector("#mecanico-input");
const formBtn = document.querySelector("#form-btn");
const notification = document.querySelector("#notification");
const tarjetas = document.querySelector(".tarjetas-grid");
 
let nombreTest = false;
let emailTest = false;
let cedulaTest = false;
let placaTest = false;
let marcaTest = false;
let modeloTest = false;
let mecanicoTest = false;
let telefonoTest = false;


const validarBoton = () => {
  if (
    nombreInput.classList.contains("aprobado") &&
    correoInput.classList.contains("aprobado") &&
    cedulaInput.classList.contains("aprobado") &&
    telefonoInput.classList.contains("aprobado") &&
    placaInput.classList.contains("aprobado") &&
    marcaInput.classList.contains("aprobado") &&
    modeloInput.classList.contains("aprobado") &&
    mecanicoInput.classList.contains("aprobado")
  ) {
    formBtn.disabled = false; 
  } else {
    formBtn.disabled = true;
  }
};
  


const validation = (element, validationTest) => {

let information = element.parentElement.querySelector(".information")

  // Manejo de clases visuales en el input
if (element.value === '') {
    element.classList.remove("aprobado", "error");
        information.classList.remove("show-information");
  } else if (validationTest) {
    element.classList.add("aprobado");
    element.classList.remove("error");
     information.classList.remove("show-information");
  } else {
    element.classList.add("error");
    element.classList.remove("aprobado");
    information.classList.add("show-information");
  }
  validarBoton();
};

nombreInput.addEventListener("input", (e) => {
  nombreTest = NAME_REGEX.test(e.target.value);
  validation(nombreInput, nombreTest);
});

correoInput.addEventListener("input", (e) => {
  emailTest = EMAIL_REGEX.test(e.target.value);
  validation(correoInput, emailTest);
});

cedulaInput.addEventListener("input", (e) => {
  cedulaTest = CEDULA_REGEX.test(e.target.value);
  validation(cedulaInput, cedulaTest);
});

telefonoInput.addEventListener("input", (e) => {
  telefonoTest = PHONE_REGEX.test(e.target.value);
  validation(telefonoInput, telefonoTest);
});

placaInput.addEventListener("input", (e) => {
  placaTest = PLACA_REGEX.test(e.target.value);
  validation(placaInput, placaTest);
});

marcaInput.addEventListener("input", (e) => {
  marcaTest = MARCA_REGEX.test(e.target.value);
  validation(marcaInput, marcaTest);
});

modeloInput.addEventListener("input", (e) => {
  modeloTest = MODELO_REGEX.test(e.target.value);
  validation(modeloInput, modeloTest);
});

mecanicoInput.addEventListener("change", (e) => {
  // Es válido si el valor no está vacío (o sea, si seleccionó una opción real)
  mecanicoTest = e.target.value !== "";
  validation(mecanicoInput, mecanicoTest);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
 
  try {
    const newVehiculo = {
      nombre: nombreInput.value,
      cedula: cedulaInput.value,
      correo: correoInput.value,
      telefono: telefonoInput.value,
      placa: placaInput.value,
      marca: marcaInput.value,
      modelo: modeloInput.value,
      mecanico: mecanicoInput.value
    };
 
    console.log("Enviando datos al servidor...", newVehiculo);
    const { data } = await axios.post("/api/cars", newVehiculo);
    console.log( data )
    createNotification(false, "Vehiculo registrado exitosamente");
 
    // Limpieza de valores en el formulario
    nombreInput.value = "";
    cedulaInput.value = "";
    correoInput.value = "";
    telefonoInput.value = "";
    placaInput.value = "";
    marcaInput.value = "";
    modeloInput.value = "";
    mecanicoInput.value = "";

    // Resetear estados lógicos
    nombreTest = false;
    emailTest = false;
    cedulaTest = false;
    telefonoTest = false;
    placaTest = false;
    marcaTest = false;
    modeloTest = false;
    mecanicoTest = false;

    // Limpiar estados visuales
    validation(nombreInput, nombreTest);
    validation(correoInput, emailTest);
    validation(cedulaInput, cedulaTest);
    validation(telefonoInput, telefonoTest);
    validation(placaInput, placaTest);
    validation(marcaInput, marcaTest);
    validation(modeloInput, modeloTest);
  validation(mecanicoInput, mecanicoTest);

if (tarjetas) {
      const nuevaTarjeta = document.createElement("div");
      nuevaTarjeta.className = "tarjeta-vehiculo";
      nuevaTarjeta.innerHTML = `
        <div class="tarjeta-top">
          <span class="placa-badge">${data.placa || newVehiculo.placa}</span>
          <span class="orden-numero">Orden #${data.order.numero_orden}</span>
        </div>

        <div class="tarjeta-info">
          <h3 class="vehiculo-nombre">${newVehiculo.marca} ${newVehiculo.modelo}</h3>
          <p class="propietario-nombre">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            ${newVehiculo.nombre}
          </p>
        </div>

        <div class="tarjeta-detalles-tecnicos">
          <div class="detalle-fila">
            <span class="detalle-etiqueta">Fase:</span>
            <span class="detalle-valor">Recibido</span>
          </div>
          <div class="detalle-fila">
            <span class="detalle-etiqueta">Aprobación:</span>
            <span class="detalle-valor valor-pendiente">Pendiente</span>
          </div>
          <div class="detalle-fila">
            <span class="detalle-etiqueta">Presupuesto:</span>
            <span class="detalle-valor valor-monto">0.0$</span>
          </div>
        </div>

        <div class="tarjeta-acciones">
          <button class="btn-detalles">Ver detalles</button>
          <button class="btn-editar">Editar</button>
        </div>
      `;

      tarjetas.prepend(nuevaTarjeta);
    }

  } catch (error) {
    // Manejo de errores
    const errorMsg = error.response?.data?.error || error.message || "Error desconocido al registrar";
    createNotification(true, errorMsg);
    setTimeout(() => { notification.innerHTML = "" }, 5000);
  }
});