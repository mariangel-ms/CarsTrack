const mongoose = require("mongoose");

// Se definen las propiedades o atributos de la base de datos
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: String,
    passwordHash: String,
    cedula: {
        type: String,
        required: true,
        unique: true, // Evita que dos administradores tengan la misma cédula
        trim: true
    },
    verified:{
        type: Boolean,
        default: false
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
})

//Se crea el modelo
const User = mongoose.model('User', userSchema);

//Se exporta el modelo
module.exports = User;