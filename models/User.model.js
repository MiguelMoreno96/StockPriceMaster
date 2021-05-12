const { months } = require('moment');
const mongoose = require('mongoose');



const UserModel = new mongoose.Schema({
    Nombre : String,
    Apellido_paterno : String,
    Apellido_materno : String,
    Edad : Number,
    Correo :{
        type: String,
        unique: true
    },
    Password : String,
    ResetPassword : String,
    Rol : String,
    Departamento: String,
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