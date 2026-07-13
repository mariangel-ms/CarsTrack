const emailImput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const form = document.getElementById("submit-btn");
const errorText = document.getElementById("error-text");

// console.log(axios);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const user = {
    email: emailImput.value,
    password: passwordInput.value
    }
    // console.log(user);
    await axios.post("/api/login", user);
    window.location.pathname = `/todos/`;
  } catch (error) {
    console.log(error)
  }
});