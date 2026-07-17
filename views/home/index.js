import { createNotification } from "/components/notification.js";

const cedulaInput = document.getElementById("client-cedula");
const placaInput = document.getElementById("client-placa");
const form = document.getElementById("form-consulta-cliente");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    const user = {
      cedula: cedulaInput.value,
      placa: placaInput.value
    };

    // Petición al backend
    await axios.post("/api/client-login", user);
    window.location.pathname = `/client-panel/`;

  } catch (error) {
    const errorMessage = error.response?.data?.error || "Ocurrió un error inesperado";
    createNotification(true, errorMessage);
  }
});