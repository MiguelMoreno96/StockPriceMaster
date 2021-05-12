const { months } = require('moment');
const mongoose = require('mongoose');


const UserModel = new mongoose.Schema({
    nombre : {
        type: String,
        required: [true, 'Se necesita de un nombre'],
        trim: true
    },

    apellido_paterno : {
        type: String,
        required: [true, 'Se necesita de un apellido paterno'] 
    },
    apellido_materno : String,
    edad : Number,
    correo :{
        type: String,
        required: [true, 'Se debe de tener un correo'],
        unique: true
    },

    password : {
        type: String,
        required: [true, 'Se debe de agregar una contraseña']
    },
    resetPassword : String,
    rol: {
        type: String,
        enum: ['Administrador', 'Gerente', 'Vendedor'],
        default: 'Vendedor'
    },
    departamento: {
        type: String,
        enum: ['Sistemas','Marketing','Comercial','Costos', 'Facturacion']
    },

    

    CreateAt : {
        type : Date,
        default : Date.now()
    },
    ModifyAt : {
        type : Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('User', UserModel)