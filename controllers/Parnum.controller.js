const ParnumModel = require('../models/Parnum.model');
const StockPriceModel = require('../models/StockPrice.model');
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


exports.putOneRegister = async (req, res, next) => {
    try {
        const parnum = await ParnumModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true, runValidators:true})
        
        if(!parnum) return res.status(404).json({success: false,message: 'error al actualizar'});

        return  res.status(200).json({success: true,data:parnum})

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}

exports.getOneParnumRegisterBySku = async (req, res, next) => {
   try {
        const sku = req.params.sku;
        const findSku = await ParnumModel.find({SKU_c:sku});
        if(!findSku){
            return res.status(400).json({
                success:false,
                message:'Error al buscar por Sku'
            });
        }
        return res.status(200).json({
            success: true,
            findSku
        })
   } catch (error) {
        return res.status(500).json({
        success: false,
        message: 'Problemas con el servidor contacte al administrador'
    });
   }
}

exports.findAllinformationProduct = async ( req ,res ,next ) => {
    try {
        const product = await (await StockPriceModel.find({Ventiapp_1:req.params.sku},{__v:0}));
        const arrayTemp = [];
        
        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Error al buscar el producto'
            });
        }
        else{
            for(stocks of product){
                const sku =stocks.Ventiapp_1                
                const [{Part,Description}] =await ParnumModel.find({SKU_c:sku},{_id:0,SKU_c:0,PrecioWeb:0,__v: 0});

                if(!Part){
                    return res.status(400).json({
                        success: false,
                        message: 'Error al buscar el parnum'
                    });
                }
                
               
                const {createAt, _id, Ventiapp, Ventiapp_1, MercadoLibre, MercadoLibre_1, ClaroShop, ClaroShop_1, Shopify, Shopify_1, Elektra,
                        Elektra_1,
                        WalmartEDI,
                        WalmartEDI_1,
                        Linio,
                        Linio_1,
                        Linio_2,} = stocks;
                arrayTemp.push({createAt, _id, Ventiapp, Ventiapp_1, MercadoLibre, MercadoLibre_1, ClaroShop, ClaroShop_1, Shopify, Shopify_1,Elektra,
                    Elektra_1,
                    WalmartEDI,
                    WalmartEDI_1
                    ,Linio,
                    Linio_1,
                    Linio_2,Part: Part, "Description": Description});

            }
            
            
            return res.status(200).json({
                success: true,
                arrayTemp
            });
        }
    } catch ( error ) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor, contacte al administrador'
        });
    }
}

exports.findAllinformationProductDate = async ( req ,res ,next ) => {
    try {
        const product = await (await StockPriceModel.find({Ventiapp_1:req.params.sku},{__v:0}));
        const arrayTemp = [];
        let startDate = req.params.start;
        let endDate = req.params.end;
        const tomorrow = new Date(endDate)
        tomorrow.setDate( tomorrow.getDate() + 1 )
        endDate = tomorrow;

        if(!product){
            return res.status(400).json({
                success: false,
                message: 'Error al buscar el producto'
            });
        }
        else{
            for(stocks of product){
                const sku =stocks.Ventiapp_1                
                const [{Part,Description}] =await ParnumModel.find({SKU_c:sku},{_id:0,SKU_c:0,PrecioWeb:0,__v: 0});

                if(!Part){
                    return res.status(400).json({
                        success: false,
                        message: 'Error al buscar el parnum'
                    });
                }
                
               
                const {createAt, _id, Ventiapp, Ventiapp_1, MercadoLibre, MercadoLibre_1, ClaroShop, ClaroShop_1, Shopify, Shopify_1, Elektra,
                        Elektra_1,
                        WalmartEDI,
                        WalmartEDI_1,
                        Linio,
                        Linio_1,
                        Linio_2,} = stocks;
                arrayTemp.push({createAt, _id, Ventiapp, Ventiapp_1, MercadoLibre, MercadoLibre_1, ClaroShop, ClaroShop_1, Shopify, Shopify_1,Elektra,
                    Elektra_1,
                    WalmartEDI,
                    WalmartEDI_1
                    ,Linio,
                    Linio_1,
                    Linio_2,Part: Part, "Description": Description});

            }
            if(startDate != null && endDate != null){
                console.log("entro a la fecha con valor")
                startDate = Date.parse( startDate );
                endDate = Date.parse( endDate );

                let stockM = arrayTemp.filter(_stock => Date.parse(_stock.createAt) >= startDate && Date.parse(_stock.createAt) <= endDate);
                console.log(" encontrados"+stockM.length)
                
                if(stockM.length<1) return res.status(400).json({
                    success:false,message: 'No hay carga en este Rango de fecha'})
                else{
                    return res.status(200).json({success: true, stock: stockM})
                    
                }
            }
        }
    } catch ( error ) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor, contacte al administrador'
        });
    }
}