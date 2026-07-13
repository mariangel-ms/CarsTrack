const loginRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

loginRouter.post('/', async (request, response) => {
  console.log("Login request received");
  const { email, password } = request.body;
  const userExists = await User.findOne({ email });
  console.log(email, password);
  
  if (!userExists) {
    return response.status(400).json({error: "email o contraseña incorrectos"});
  }

  if (!userExists.verified) { 
    return response.status(400).json({error: "Tu email no ha sido verificado"});
  }

  const isCorrect = await bcrypt.compare(password, userExists.passwordHash);

  if (!isCorrect) {
    return response.status(400).json({error: "email o contraseña incorrectos"});
  }

  const userForToken = {
    id: userExists._id,
  };

  const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });


  response.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expira en 1 día
    secure: process.env.NODE_ENV === 'production', // Solo se envía en producción
    httpOnly: true, // No accesible desde JavaScript
  });

  return response.status(200).json("Login exitoso");
});

module.exports = loginRouter;