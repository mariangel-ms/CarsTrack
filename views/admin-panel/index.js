import { createNotification } from "/components/notification.js";

const form = document.querySelector("#form-registro");
const nombreInput = document.querySelector("#nombre-input");
const cedulaInput = document.querySelector("#cedula-input");
const correoInput = document.querySelector("#correo-input");
const telefonoInput = document.querySelector("#telefono-input");
const placaInput = document.querySelector("#placa-input");
const marcaInput = document.querySelector("#marca-input");
const modeloInput = document.querySelector("#modelo-input");
const formBtn = document.querySelector("#form-btn");
const notification = document.querySelector("#notification");
 
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
    };
 
    const { data } = await axios.post("/api/cars", newVehiculo);
    createNotification(false, "Vehiculo registrado exitosamente");
 
    // Limpieza de valores en el formulario
    nombreInput.value = "";
    cedulaInput.value = "";
    correoInput.value = "";
    telefonoInput.value = "";
    placaInput.value = "";
    marcaInput.value = "";
    modeloInput.value = "";
 
    nombreTest = false;
    cedulaTest = false;
    correoTest = false;
    telefonoTest = false;
    placaTest = false;
    marcaTest = false;
    modeloTest = false;
 
    // Ejecutamos la validación para limpiar estilos visuales y bloquear el botón de nuevo
    validation(nombreInput, nombreTest);
    validation(cedulaInput, cedulaTest);
    validation(correoInput, correoTest);
    validation(telefonoInput, telefonoTest);
    validation(placaInput, placaTest);
    validation(marcaInput, marcaTest);
    validation(modeloInput, modeloTest);
 
    // Aqui puedes refrescar la lista de vehiculos en el panel, por ejemplo:
    // renderVehiculos(data);
 
  } catch (error) {
    // Manejo de errores
    createNotification(true, error.response.data.error);
    setTimeout(() => { notification.innerHTML = "" }, 5000);
  }
});