const mongoose = require("mongoose");

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
    // --- FASE: Recibido ---
    recepcion: {
        fecha: { type: Date },
        kilometraje: { type: Number, min: 0 },
        nivel_combustible: {
            type: String,
            enum: ["vacio", "cuarto", "medio", "tres-cuartos", "lleno"]
        },
        estado_general: { type: String, trim: true }
    },
    // --- FASE: Diagnostico ---
    diagnostico: {
        problema_reportado: { type: String, trim: true },
        diagnostico_realizado: { type: String, trim: true },
        fecha: { type: Date }
    },
    administrador: {
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
    presupuesto_enviado: {
        type: Boolean,
        default: false
    },
    aprobacion_reparacion: {
        type: String,
        enum: ["Pendiente", "Aprobado", "Rechazado"],
        default: "Pendiente"
    },
    repuestos: [repuestoSchema],
    mano_obra: {
        type: Number,
        default: 0,
        min: 0
    },
    costo_total: {
        type: Number,
        default: 0
    },
    // --- FASE: Reparacion ---
    reparaciones: [{
        descripcion: { type: String, required: true, trim: true },
        estado: {
            type: String,
            enum: ["pendiente", "lista"],
            default: "pendiente"
        }
    }],
    // --- FASE: Control de calidad (testing.js) ---
    pruebas: {
        observaciones: { type: String, trim: true },
        resultado: {
            type: String,
            enum: ["aprobado", "revision"]
        }
    },
    // --- FASE: Listo para entrega ---
    listo_entrega: {
        fecha_estimada_retiro: { type: Date },
        notas: { type: String, trim: true }
    },

        entregado: {
        fecha_retirado: { type: Date },
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