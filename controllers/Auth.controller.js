const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//@desc   Register user
//@route  POST /api/v1/auth/register
//@access Public
exports.register = async(req,res,next) => {
    try {

        let newUser = {
            nombre: req.body.nombre,
            apellido_paterno: req.body.apellido_paterno,
            apellido_materno: req.body.apellido_materno,
            edad: req.body.edad,
            correo: req.body.correo,
            password: bcrypt.hashSync(req.body.password, 10),
            rol: req.body.rol,
            departamento: req.body.departamento
        }
        console.log(req.body)
        const user = await User.create(newUser);
        if(!user) return res.status(400).json({
            success: false,
            message: `Error no se pudo registrar el usuario: ${req.body.nombre}`
        })

        return res.status(201).json({
            success: true,
            message: 'Usuario creado',
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor, por favor intentar más tarde'
        })
    }
}

//@desc   POST Login
//@route  POST /api/v1/auth/login
//@access Public

exports.login = async(req,res,next) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(404).json({
            message: 'Porfavor de proveer un email o un password'
        })
    }

    const user = await User.findOne({ correo: correo });
    console.log(user)
    if (!user) {
        return res.status(404).json({
            message: 'Error de credenciales'
        }) ;
    } 
    
    if(!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({
            err: {message: 'La contraseña es incorrecta'}
        })
    }

    let token = jwt.sign({
        user: user
    }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

    return res.status(200).json({
        success: true,
        token
    })
}