const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const axios = require("axios");

// Ruta para registrar un nuevo usuario
usersRouter.post("/", async (request, response) => {
  const { name, email, password, cedula } = request.body;

  if (!name || !email || !password || !cedula) {
    return response
      .status(400)
      .json({ error: "Todos los espacios son requeridos" });
  }

  try {
    // Verificar si el email ya está registrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return response
        .status(400)
        .json({ error: "El email ya se encuentra en uso" });
    }

    try {
      const apiKey = process.env.API_KEY;
      const url = `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;

      const abstractResponse = await axios.get(url);
      const status = abstractResponse.data.email_deliverability.status;

      if (status === "deliverable") {

      } else {
        return response.status(400).json({
          error: `El correo no es valido.`,
        });
      }
    } catch (apiError) {
      console.error("Error al conectar con Abstract API:", apiError.message);
      return response.status(500).json({ error: "Error al verificar el correo con el servicio externo." });
    }

    // Encriptar la contraseña si el correo es válido
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear el documento con Mongoose
    const newUser = new User({
      name,
      email,
      passwordHash,
      cedula,
      rol: "admin",
      verified: true,
    });

    // Guardar en MongoDB
    await newUser.save();

    return response.status(201).json("Usuario creado exitosamente");
  } catch (error) {
    console.error("Error durante el proceso de registro:", error.message);
    return response
      .status(500)
      .json({ error: "Error interno del servidor al procesar el registro." });
  }
});
usersRouter.get("/:id", async (request, response) => {
  const cliente = await User.findById(request.params.id);

  if (!cliente) {
    return response.status(404).json({ error: "Usuario no encontrado" });
  }

  return response.status(200).json(cliente);
});

module.exports = usersRouter;
