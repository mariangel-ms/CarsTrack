const mongoose = require("mongoose");

// Subdocumento para cada repuesto usado en la orden (equivale a "eleccion_repuestos" del diagrama)
const repuestoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false })

// Se definen las propiedades o atributos de la base de datos
const orderSchema = new mongoose.Schema({
    numero_orden: {
        type: Number,
        required: true,
        unique: true
    },
    estado: {
        type: String,
        required: true,
        default: "Recibido"
    },
    estado_fisico: {
        type: String,
        trim: true
    },
    mecanico: {type: String},
    administrador: {
        // Equivale a "cedula_admin" (FK) del diagrama: el admin que gestiona/creó la orden
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        cedula: {
            type: String,
            trim: true
        },
        nombre: {
            type: String,
            trim: true
        }
    },
    cliente: {
        // Snapshot derivado de vehiculo.cliente al crear la orden
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
            required: true,
            trim: true
        }
    },
    vehiculo: {
        // Equivale a "placa vehiculo" (FK) del diagrama
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car'
        },
        placa: {
            type: String,
            required: true,
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
        }
    },
    aprobacion_reparacion: {
        type: String,
        default: "Pendiente"
    },
    repuestos: [repuestoSchema],
    mano_obra: {
        type: Number,
        default: 0,
        min: 0
    },
    costo_total: {
        // Equivale a "costo final" del diagrama
        type: Number,
        default: 0
    }
}, {
     timestamps: true 
    })

orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

//Se crea el modelo
const Order = mongoose.model('Order', orderSchema);

//Se exporta el modelo
module.exports = Order;