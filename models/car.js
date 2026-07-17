const mongoose = require("mongoose");
 
// Se definen las propiedades o atributos de la base de datos
const carSchema = new mongoose.Schema({
    placa: {
        type: String,
        required: true,
        unique: true, // Evita que dos vehiculos tengan la misma placa
        trim: true,
        uppercase: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    modelo: {
        type: String,
        required: true,
        trim: true
    },
    cliente: {
        // Referencia al usuario dueño del vehiculo (rol: "cliente")
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        cedula: {
            type: String,
            required: true,
            trim: true
        },
        nombre: {
            type: String,
            trim: true
        }
    }
})
 
carSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
 
//Se crea el modelo
const Car = mongoose.model('Car', carSchema);
 
//Se exporta el modelo
module.exports = Car;