const StockPriceModel = require('../models/StockPrice.model');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');



exports.getindex = async(req,res,next) => {
    res.sendFile(__dirname,'index.html');
}
exports.getAllStockPrice = async (req,res,next) => {
    try {
        const stock = await StockPriceModel.find();
        if(!stock) return res.status(400).json({
            success: false,
            message: 'No se pudo traer los stock'
        });

        return  res.status(200).json({
            success: true,
            count: stock.length,
            data: stock
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'No se pudo traer los stock'
        });
    }
}


exports.createStockPrice = async (req,res,next) => {
    try {
        const stockPrice = xlsx.readFile('./public/docs/stockPrice.xlsx');
        let workSheet = stockPrice.Sheets["Productos"] ;
        let listJson = xlsx.utils.sheet_to_json(workSheet);
        console.log(listJson.length, 'list');
        listJson.map(async (item) => {
            if(typeof(item.MercadoLibre) !== 'string') {
                const data = await StockPriceModel.create(item);
                return data
            }
        })

        return res.status(201).json({
            success: true,
            message: 'se esta guardado el archivo espere un momento'
        })
    } catch (error) {}
}


exports.searchSku = async (req,res,next) => {
    try {
        const stock = await StockPriceModel.find({ Ventiapp_1: req.params.sku });
        if(!stock) return res.status(404).json({
            success: false,
            message: 'no se encontro el sku'
        })
        
        return  res.status(200).json({
            success: true,
            data: stock
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}


exports.updateStock = async(req,res,next)=>{
    try {
        const stock = await StockPriceModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true, runValidators:true})
        console.log(req.body)
        console.log(stock)
        
        if(!stock) return res.status(404).json({success: false,message: 'error al actualizar'});

        return  res.status(200).json({success: true,message: 'ok entro',data:stock})

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}

exports.searchChannel = async(req,res,next)=>{
    try {
        const channel = req.params.Seller;

        const stock = await StockPriceModel.find({},{_id:0,__v:0,Linio:0,Linio_1:0,Linio_2:0,ClaroShop:0,
            ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0});

        const stockL = await StockPriceModel.find(
            {Linio:{$gte:1}},{_id:0,createAt:1,Ventiapp:1,Ventiapp_1:1,Linio:1,Linio_1:1});

        const stockCs = await StockPriceModel.find(
            {},{_id:0,__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                Shopify:0,Shopify_1:0,Shopify_2:0});

        const stockSp = await StockPriceModel.find(
            {},{_id:0,__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0});

        const stockEK = await StockPriceModel.find(
            {},{__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0}
        );
        const stockWM = await StockPriceModel.find(
            {},{__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0,
                Elektra:0,Elektra_1:0}
        );

        switch(channel){
            case 'MercadoLibre':    
                let stockM =stock.filter(_stock =>(_stock.MercadoLibre!= 0 
                    && _stock.MercadoLibre_1!= 0)&&(_stock.MercadoLibre!= null 
                    && _stock.MercadoLibre_1!= null));
                if(stockM.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockM });
            break;
            case 'Linio':
                    if(stockL.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                    res.status(200).json({success:true,stockL });
            break;
            case 'ClaroShop':
                let stockC= stockCs.filter(_Cs =>(_Cs.ClaroShop!=0&&_Cs.ClaroShop_1!=0&& _Cs.ClaroShop_2!=0)
                &&(_Cs.ClaroShop!=null&&_Cs.ClaroShop_1!=null));
                if(stockC.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockC});
                break;
            case 'Shopify':
                let stockS= stockSp.filter(_Sp =>(_Sp.Shopify!=0&&_Sp.Shopify_1!=0&& _Sp.Shopify_2!=0)
                &&(_Sp.Shopify!=null&&_Sp.Shopify_1!=null));
                if(stockS.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockS});
                break;
            case 'Elektra':
                let stockE = stockEK.filter(_Ek => (_Ek.Elektra != 0 && _Ek.Elektra_1 != 0) &&
                                            (_Ek.Elektra != null && _Ek.Elektra_1 != null)/* &&
                                            (_Ek.Ventiapp_1 === sku)*/);
                if(stockE.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockE});
            break;
            case 'Walmart':
                let stockWMkt =stockWM.filter(_Wm =>(_Wm.WalmartEDI != 0 && _Wm.WalmartEDI_1 != 0) &&
                                                  (_Wm.WalmartEDI != null && _Wm.WalmartEDI_1 != null) 
                                                   /*&&(_Wm.Ventiapp_1 === sku)*/);
                if(stockWMkt.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockWMkt});
            break;
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}
exports.searchDate = async(req,res,next)=>{
    try {
        let oldDate=req.params.createAt
        let stock = await StockPriceModel.find();
        let date =new Date(oldDate);
        console.log(date)
        date= Date.parse(date)
        console.log(date)
        let stockM =stock.filter(_stock =>Date.parse(_stock.createAt)=== date);
       
        if(stockM.length<0)return res.status(400).json({
            success:false,message: 'fecha no esta registrada'})

        return res.status(200).json({success: true, stock: stockM})

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}
exports.getMasterSearch = async(req,res,next)=>{
    try {
        console.log("!Estas en master!")
        let seller=req.params.Seller      
        let startDate=req.params.start;
        let endDate=req.params.end;
        const tomorrow = new Date(endDate)
        tomorrow.setDate(tomorrow.getDate() + 1)
        console.log(tomorrow);
        endDate=tomorrow;
        
        console.log(endDate)
        console.log(startDate!=null && endDate!=null)
        if(startDate!=null && endDate!=null){
            console.log("fecha de inicio desde master:"+ startDate)
            console.log("fecha de fin desde master: "+ endDate)
            let stock = await StockPriceModel.find();
            startDate = Date.parse(startDate);
            endDate= Date.parse(endDate);
            
            console.log("star: "+startDate+" end: "+ endDate)

            let stockM =stock.filter(_stock =>Date.parse(_stock.createAt)>= startDate && Date.parse(_stock.createAt)<=endDate);
            
            if(stockM.length<0)return res.status(400).json({
                success:false,message: 'fecha no existe en este rango'})

            return res.status(200).json({success: true, stock: stockM})
        }
         else if(startDate!=null){
            let stock = await StockPriceModel.find();
            let date_1 =new Date(startDate);
            console.log(date_1)
            date_1= Date.parse(date_1)
            console.log(date_1)
            let stockM =stock.filter(_stock =>Date.parse(_stock.createAt)=== date_1);
        
            if(stockM.length<0)return res.status(400).json({
                success:false,message: 'fecha no esta registrada'})

            return res.status(200).json({success: true, stock: stockM})
        } else if(seller!=null){
            const stock = await StockPriceModel.find({},{_id:0,__v:0,Linio:0,Linio_1:0,Linio_2:0,ClaroShop:0,
                ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0});
                console.log("lenght: "+stock.length);
            const stockL = await StockPriceModel.find(
                {Linio:{$gte:1}},{_id:0,createAt:1,Ventiapp:1,Ventiapp_1:1,Linio:1,Linio_1:1});
                console.log("lenght: "+stockL.length);
            const stockCs = await StockPriceModel.find(
                {},{_id:0,__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                    Shopify:0,Shopify_1:0,Shopify_2:0});
                console.log("lenghtCs: "+stockCs.length);
            const stockSp = await StockPriceModel.find(
                {},{_id:0,__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                    ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0});
            console.log("x:"+seller);
    
            switch(seller){
                case 'MercadoLibre':    
                    let stockM =stock.filter(_stock =>(_stock.MercadoLibre!= 0 
                        && _stock.MercadoLibre_1!= 0)&&(_stock.MercadoLibre!= null 
                        && _stock.MercadoLibre_1!= null));
                    if(stockM.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                    res.status(200).json({success:true,stockM });
                break;
                case 'Linio':
                        if(stockL.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                        res.status(200).json({success:true,stockL });
                break;
                case 'ClaroShop':
                    let stockC= stockCs.filter(_Cs =>(_Cs.ClaroShop!=0&&_Cs.ClaroShop_1!=0&& _Cs.ClaroShop_2!=0)
                    &&(_Cs.ClaroShop!=null&&_Cs.ClaroShop_1!=null));
                    console.log("2: "+stockC.length);
                    if(stockC.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                    res.status(200).json({success:true,stockC});
                    break;
                case 'Shopify':
                    let stockS= stockSp.filter(_Sp =>(_Sp.Shopify!=0&&_Sp.Shopify_1!=0&& _Sp.Shopify_2!=0)
                    &&(_Sp.Shopify!=null&&_Sp.Shopify_1!=null));
                    console.log("Sp: "+stockS.length);
                    if(stockS.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                    res.status(200).json({success:true,stockS});
                    break;
                    
                default:
                    res.status(404).json({success:false,message:'Por el momento no contamos con ese Sheller'})
                    break;
            }
        }
        //------
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}

exports.searchDateRange = async(req,res,next)=>{
    try {
        let startDate=req.params.start;
        let endDate=req.params.end;
        
        console.log("fecha de inicio:"+ startDate)
        console.log("fecha de fin: "+ endDate)
        let stock = await StockPriceModel.find();
        startDate = Date.parse(startDate);
        endDate= Date.parse(endDate);
        
        console.log("star: "+startDate+" end: "+ endDate)

        let stockM =stock.filter(_stock =>Date.parse(_stock.createAt)>= startDate && Date.parse(_stock.createAt)<=endDate);
        
        if(stockM.length<0)return res.status(400).json({
            success:false,message: 'fecha no existe en este rango'})

        return res.status(200).json({success: true, stock: stockM})

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor conttacte al administrador'
        });
    }
}

exports.searchMasterChannelSku = async(req,res,next) => {
    try {
        const channel = req.params.Seller;
        const sku = req.params.sku

        const stock = await StockPriceModel.find({},{__v:0,Linio:0,Linio_1:0,Linio_2:0,ClaroShop:0,
            ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0});

        const stockL = await StockPriceModel.find(
            {Linio:{$gte:1}},{createAt:1,Ventiapp:1,Ventiapp_1:1,Linio:1,Linio_1:1});

        const stockCs = await StockPriceModel.find(
            {},{__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                Shopify:0,Shopify_1:0,Shopify_2:0});

        const stockSp = await StockPriceModel.find(
            {},{__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0});
        const stockEK = await StockPriceModel.find(
            {},{__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0}
        );
        const stockEKM = await StockPriceModel.find(
            {},{__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0}
        );
        const stockWMM = await StockPriceModel.find(
            {},{__v:0,Linio:0,Linio_1:0,Linio_2:0,MercadoLibre:0,MercadoLibre_1:0,
                ClaroShop:0,ClaroShop_1:0,ClaroShop_2:0,Shopify:0,Shopify_1:0,Shopify_2:0,
                Elektra:0,Elektra_1:0}
        );
                console.log("x:"+channel);

        switch(channel){
            case 'MercadoLibre':    
                let stockM =stock.filter(_stock =>(_stock.MercadoLibre != 0 
                    && _stock.MercadoLibre_1 != 0)&&(_stock.MercadoLibre != null 
                    && _stock.MercadoLibre_1 != null) && (_stock.Ventiapp_1 === sku));
                if(stockM.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockM });
            break;
            case 'Linio':
                let stockLinio = stockL.filter(_stockL => _stockL.Ventiapp_1 === sku)
                    if ( stockLinio.length<0 ) {res.status(400).json({success:false,message:'No se encontro el canal'})}
                    res.status(200).json({success:true,stockLinio });
            break;
            case 'ClaroShop':
                let stockC= stockCs.filter(
                    _Cs =>(_Cs.ClaroShop!=0&&_Cs.ClaroShop_1!=0&& _Cs.ClaroShop_2!=0)
                    &&(_Cs.ClaroShop!=null&&_Cs.ClaroShop_1!=null && _Cs.Ventiapp_1 === sku));
                console.log("CLaroShop:::: "+stockC.length);
                if(stockC.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockC});
                break;
            case 'Shopify':
                let stockS= stockSp.filter(_Sp => (_Sp.Shopify != 0 && _Sp.Shopify_1 != 0 && _Sp.Shopify_2 != 0)
                && (_Sp.Shopify != null && _Sp.Shopify_1 != null) && (_Sp.Ventiapp_1 === sku));
                console.log("Sp: "+stockS.length);
                if(stockS.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockS});
                break;
            case 'Elektra':
                let stockE = stockEKM.filter(_Ek => (_Ek.Elektra != 0 && _Ek.Elektra_1 != 0) &&
                                                (_Ek.Elektra != null && _Ek.Elektra_1 != null) &&
                                                (_Ek.Ventiapp_1 === sku));
                if(stockE.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockE});
            break;
            case 'Walmart':
                let stockWMkt =stockWMM.filter(_Wm =>(_Wm.WalmartEDI != 0 && _Wm.WalmartEDI_1 != 0) &&
                                                    (_Wm.WalmartEDI != null && _Wm.WalmartEDI_1 != null) 
                                                    &&(_Wm.Ventiapp_1 === sku));
                if(stockWMkt.length<0){res.status(400).json({success:false,message:'No se encontro el canal'})}
                res.status(200).json({success:true,stockWMkt});
            break;
            default:
                return res.status(404).json({
                    success: false,
                    message: 'Por el momento no contamos con ese Sheller'
                });
            break;
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}

exports.searchMasterSkuDateRange =async(req,res,next) =>{
    try {
        let sku = req.params.sku
        let startDate = req.params.start;
        let endDate = req.params.end;
        const tomorrow = new Date(endDate)
        tomorrow.setDate( tomorrow.getDate() + 1 )
        endDate = tomorrow;
        console.log(sku);
        console.log(startDate);
        console.log(endDate);
        const stock = await StockPriceModel.find({ Ventiapp_1: sku });
        if(startDate != null && endDate != null){
            console.log( "fecha de inicio desde master:" + startDate)
            console.log( "fecha de fin desde master: " + endDate)
            startDate = Date.parse( startDate );
            endDate = Date.parse( endDate );
            
            console.log( "star: " + startDate + " end: " + endDate )

            let stockM = stock.filter(_stock => Date.parse(_stock.createAt) >= startDate && Date.parse(_stock.createAt) <= endDate);
            
            if(stockM.length<0) return res.status(400).json({
                success:false,message: 'fecha no existe en este rango'})

            return res.status(200).json({success: true, stock: stockM})
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Problemas con el servidor contacte al administrador'
        });
    }
}