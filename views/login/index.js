import { createNotification } from "/components/notification.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const form = document.getElementById("admin-login-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    const user = {
      email: emailInput.value,
      password: passwordInput.value
    };

    // Petición al backend
    await axios.post("/api/login", user);
    window.location.pathname = `/panel/`;

  } catch (error) {
    const errorMessage = error.response?.data?.error || "Ocurrió un error inesperado";
    createNotification(true, errorMessage);
  }
});