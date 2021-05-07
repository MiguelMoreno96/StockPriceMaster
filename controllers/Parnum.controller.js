const ParnumModel = require('../models/Parnum.model');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const { json } = require('express');

exports.createParnum = async (req,res,next) => {
    try {
        const stockPrice = xlsx.readFile('./public/docs/Inventario.xlsx');
        let workSheet = stockPrice.Sheets["Parnums"] ;
        let listJson = xlsx.utils.sheet_to_json(workSheet);
        console.log(listJson.length, 'list');
        listJson.map(async (item) => {
            if(typeof(item.MercadoLibre) !== 'string') {
                const data = await ParnumModel.create(item);
                return data
            }
        })

        return res.status(201).json({
            success: true,
            message: 'se esta guardado el archivo espere un momento'
        })
    } catch (error) {}
}

exports.createOneParnum = async (req,res,next) => {
    try {
        const newParnum = req.body;
        console.log(req.body);
        let parnum= await ParnumModel.create(newParnum);
        
        if(!parnum){
            return res.status(404).json({
                success: false,
                message: 'Error al insertar usuario'
            })
        }else{
            
            return res.status(201).json({
                success: true,
                parnum
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor, contacte al administrador'
        });
    }
}

exports.getOneParnumRegisterById = async (req,res,next) => {
    try {
        let id = req.params.id;
        let parnumId = await ParnumModel.find({_id: id});
        if(!parnumId){
            return res.status(400).json({
                success: false,
                message: 'No tenemos carga de ese registro'
            })
        }
    return res.status(201).json({
        success: true,
        data: parnumId
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor, contacte al administrador'
        });
    }
}

exports.getOneParnumRegister = async (req,res,next) => {
    try {
        let parnum = req.params.parnum;
        let valueParnum = await ParnumModel.find({Part: parnum});
        if( !valueParnum ){
            return res.status(400).json({
                success: false,
                message :'No tenemos carga de ese registro'
            })
        }
        return res.status(201).json({
            success:true,
            valueParnum
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor, contacte al administrador'
        })
    }
}

exports.getAllParnumRegister = async (req,res,next) => {
    try {
        const Register = await ParnumModel.find();
        console.log(!Register)
        if (!Register) {return res.status(400).json({
                            success :false,
                            message: 'Error al cargar los registros'
                        });}
        
        else {return res.status(200).json({
            success: true,
            Register
        });}
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor, contacte al administrador'
        })
    }
}

/*
exports.putOneRegister = async (req, res, next) => {}
*/