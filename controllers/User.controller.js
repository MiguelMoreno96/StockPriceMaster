const UserModel = require('../models/User.model');


exports.createNewUser = async (req,res,next) => {
    try {
        const user = req.body;
        console.log(user)
        const newUser = await UserModel.create(user);
        
        if(!newUser){
            return res.status(404).json({
                success: false,
                message: 'Error al insertar usuario'
            })
        }else{
            
            return res.status(201).json({
                success: true,
                newUser
            })
        }
    } catch ( error ) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}

exports.consultUser = async (req, res, next) => {
    try {
        const email = req.params.email;

        const user = await UserModel.find({Correo:email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: 'Error al buscar al usuario'
            })
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'Problemas con el servidor, contacte al administrador'
        })
    }
}

exports.consultAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find();
        if(!users){
            return res.status(400).json({
                success:false,
                message: 'Error al cargar los usuarios'
            })
        }
        return res.status(200).json({
            success:true,
            users
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'Problemas con el servidor, contacte al administrador'
        })
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const user = await UserModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true, runValidators:true})
        
        if(!user) return res.status(404).json({success: false,message: 'error al actualizar'});

        return  res.status(200).json({success: true,data:user})

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await UserModel.findOneAndDelete({Correo:req.params.email})
    if(!user){
        return res.status(400).json({
            success:false,
            message: 'Error al eliminar el usuario'
        })
    }
    return res.status(200).json({
        success: true,
        user
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }

}