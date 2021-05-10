const ParnumModel = require('../models/Parnum.model');
const StockPriceModel = require('../models/StockPrice.model');

exports.findAllinformationProduct = async ( req ,res ,next ) => {
    try {
        const product = await (await StockPriceModel.find({Ventiapp_1:req.params.sku},{__v:0}))
        const arrayTemp = []
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
                //console.log(Part)
                if(!Part){
                    return res.status(400).json({
                        success: false,
                        message: 'Error al buscar el parnum'
                    });
                }
                arrayTemp.push({stocks,"Part": Part, "Description": Description});

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