
import { createNotification } from "/components/notification.js";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/;
const CEDULA_REGEX =/^([VEve]-?)?[0-9]{6,8}$/

const form = document.querySelector("#form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#match-input");
const cedulaInput = document.querySelector("#cedula-input");
const formBtn = document.querySelector("#form-btn");
const notification = document.querySelector("#notification");

let nameTest = false;
let emailTest = false;
let passwordTest = false;
let matchTest = false;
let cedulaTest = false;

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
  // Activación del botón se evalua el estado global de los tests
  formBtn.disabled = !(nameTest && emailTest && passwordTest && matchTest);
};

// 6. Listeners para validación en tiempo real
nameInput.addEventListener("input", (e) => {
  nameTest = NAME_REGEX.test(e.target.value);
  validation(nameInput, nameTest);
});

emailInput.addEventListener("input", (e) => {
  emailTest = EMAIL_REGEX.test(e.target.value);
  validation(emailInput, emailTest);
});

cedulaInput.addEventListener("input", (e) => {
  cedulaTest = CEDULA_REGEX.test(e.target.value);
  validation(cedulaInput, cedulaTest);
});


passwordInput.addEventListener("input", (e) => {
  passwordTest = PASSWORD_REGEX.test(e.target.value);
  matchTest = e.target.value === confirmPasswordInput.value;
  validation(passwordInput, passwordTest);
  validation(confirmPasswordInput, matchTest);
});

confirmPasswordInput.addEventListener("input", (e) => {
  matchTest = e.target.value === passwordInput.value;
  validation(confirmPasswordInput, matchTest);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const newUser = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      cedula: cedulaInput.value
    };

    const { data } = await axios.post("/api/users", newUser);

    createNotification(false, "Usuario registrado con éxito"); // Temporal para pruebas
    
    setTimeout(() => {
      notification.innerHTML = "";
    }, 5000);

    // Limpieza de valores en el formulario
    nameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
     cedulaInput.value = "";

    nameTest = false;
    emailTest = false;
    passwordTest = false;
    matchTest = false;
  cedulaTest = false;

    // Ejecutamos la validación para limpiar estilos visuales y bloquear el botón de nuevo
    validation(nameInput, nameTest);
    validation(emailInput, emailTest);
    validation(passwordInput, passwordTest);
    validation(confirmPasswordInput, matchTest);
    validation(cedulaInput, cedulaTest);

    
    setTimeout(() => { window.location.pathname = `/`;}, 2000);


  } catch (error) {
    // Manejo de errores
    createNotification(true, error.response.data.error);
    setTimeout(() => { notification.innerHTML = "" }, 5000);
  }
});