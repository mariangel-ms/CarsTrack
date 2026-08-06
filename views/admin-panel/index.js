import { createNotification } from "/components/notification.js";
import { cargarConfirmarBorrar } from "/components/confirm-delete/confirm-delete.js";


const PHONE_REGEX = /^(0414|0424|0412|0416|0426)[0-9]{7}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX =
  /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/;
const CEDULA_REGEX = /^([VEve]-?)?[0-9]{6,8}$/;
const PLACA_REGEX = /^[A-Za-z0-9]{5,}$/;
const MARCA_REGEX = /^[A-Z][A-Za-z0-9\s\-\.]{2,29}$/;
const MODELO_REGEX = /^[A-Z][A-Za-z0-9\s\-\.\#\+]{2,34}$/;

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
const buscadorInput = document.querySelector("#buscador-input");


let nombreTest = false;
let emailTest = false;
let cedulaTest = false;
let placaTest = false;
let marcaTest = false;
let modeloTest = false;
let mecanicoTest = false;
let telefonoTest = false;

let todasLasOrdenes = []; // guardamos aqui lo ultimo que trajo el backend, para poder filtrar sin pedirlo de nuevo

// Dibuja un arreglo de ordenes dentro de .tarjetas-grid (no hace peticiones, solo pinta)
const renderTarjetas = (ordenes) => {
  if (!tarjetas) return;

  tarjetas.innerHTML = "";

  if (ordenes.length === 0) {
    tarjetas.innerHTML = `<p class="sin-resultados">No se encontraron vehículos.</p>`;
    return;
  }

  ordenes.forEach((orden) => {
    const tarjetaExistente = document.createElement("div");
    tarjetaExistente.className = "tarjeta-vehiculo";

    tarjetaExistente.innerHTML = `
      <div class="tarjeta-top">
        <span class="placa-badge">${orden.vehiculo.placa}</span>
        <span class="orden-numero">Orden #${orden.numero_orden}</span>
      </div>

      <div class="tarjeta-info">
        <h3 class="vehiculo-nombre">${orden.vehiculo.marca} ${orden.vehiculo.modelo}</h3>
        <p class="propietario-nombre">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="14" height="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          ${orden.cliente.nombre}
        </p>
      </div>

      <div class="tarjeta-detalles-tecnicos">
        <div class="detalle-fila">
          <span class="detalle-etiqueta">Fase:</span>
          <span class="detalle-valor">${orden.estado}</span>
        </div>
        <div class="detalle-fila">
          <span class="detalle-etiqueta">Aprobación:</span>
          <span class="detalle-valor valor-pendiente">${orden.aprobacion_reparacion}</span>
        </div>
        <div class="detalle-fila">
          <span class="detalle-etiqueta">Presupuesto:</span>
          <span class="detalle-valor valor-monto">${orden.costo_total}$</span>
        </div>
      </div>

      <div class="tarjeta-acciones">
        <button class="btn-eliminar">Eliminar</button>
        <button class="btn-editar" data-id="${orden.id}">Editar</button>
      </div>
    `;
    tarjetas.appendChild(tarjetaExistente);

//EDITAR TARJETA
    const editarBtn = tarjetaExistente.querySelector(".btn-editar");

    editarBtn.addEventListener("click", (e) => {
      window.location.href = `/edit-order/?id=${orden.id}`;
    });

    
  //ELIMINAR TARJETA
const eliminarBtn = tarjetaExistente.querySelector(".btn-eliminar");

eliminarBtn.addEventListener("click", () => {

  cargarConfirmarBorrar(
    orden.id,
    orden.aprobacion_reparacion,
    tarjetaExistente

  );

});
  });
};
// Trae las ordenes del backend, las guarda en memoria, y las dibuja
const cargarVehiculos = async () => {
  try {
    const response = await axios.get("/api/cars");
    todasLasOrdenes = response.data;
    console.log(todasLasOrdenes);
    renderTarjetas(todasLasOrdenes);
    actualizarStats(todasLasOrdenes)
  } catch (error) {
    console.error("Error al cargar los vehículos:", error);
  }
};

cargarVehiculos();

// Filtra en memoria por placa o modelo
buscadorInput.addEventListener("input", (e) => {
  const texto = e.target.value.trim().toLowerCase();

  if (texto === "") {
    renderTarjetas(todasLasOrdenes);
    return;
  }

  const filtradas = todasLasOrdenes.filter((orden) => {
    const placa = (orden.vehiculo.placa || "").toLowerCase();
    const modelo = (orden.vehiculo.modelo || "").toLowerCase();
    return placa.includes(texto) || modelo.includes(texto);
  });

  renderTarjetas(filtradas);
});

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
  let information = element.parentElement.querySelector(".information");

  // Manejo de clases visuales en el input
  if (element.value === "") {
    element.classList.remove("aprobado", "error");
    if (information) information.classList.remove("show-information");
  } else if (validationTest) {
    element.classList.add("aprobado");
    element.classList.remove("error");
    if (information) information.classList.remove("show-information");
  } else {
    element.classList.add("error");
    element.classList.remove("aprobado");
    if (information) information.classList.add("show-information");
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
  // Es valido si el valor no esta vacio
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
      mecanico: mecanicoInput.value,
    };

    const { data } = await axios.post("/api/cars", newVehiculo);
    // console.log(data);
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
      await cargarVehiculos();
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.error ||
      error.message ||
      "Error desconocido al registrar";
    createNotification(true, errorMsg);
    setTimeout(() => {
      notification.innerHTML = "";
    }, 5000);
  }
});


// Función para calcular y pintar las tarjetitas de arriba
const actualizarStats = (ordenes) => {
  const statActivas = document.querySelector("#stat-activas");
  const statListos = document.querySelector("#stat-listos");
  const statPresupuestos = document.querySelector("#stat-presupuestos");

  // Filtramos según el estado de la orden
  const activas = ordenes.filter(o => 
    (o.estado || "").toLowerCase() !== "entregado" && 
    (o.estado || "").toLowerCase() !== "listo"
  ).length;

  const listos = ordenes.filter(o => 
    (o.estado || "").toLowerCase() === "listo" || 
    (o.estado || "").toLowerCase() === "entregado"
  ).length;

  const presupuestos = ordenes.filter(o => 
    (o.aprobacion_reparacion || "")
  ).length;

  if (statActivas) statActivas.textContent = activas;
  if (statListos) statListos.textContent = listos;
  if (statPresupuestos) statPresupuestos.textContent = presupuestos;
};