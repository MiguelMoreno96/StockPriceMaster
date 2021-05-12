const { months } = require('moment');
const mongoose = require('mongoose');



const StockPriceModel = new mongoose.Schema({
    Ventiapp: String,
    Ventiapp_1: String,
    MercadoLibre: Number,
    MercadoLibre_1: Number,
    Linio: Number,
    Linio_1: Number,
    Linio_2: Number,
    ClaroShop: Number,
    ClaroShop_1: Number,
    ClaroShop_2: Number,
    Shopify: Number,
    Shopify_1: Number,
    Shopify_2: Number,
    Elektra: Number,
    Elektra_1: Number,
    WalmartEDI:Number,
    WalmartEDI_1:Number,
    createAt: {
        type: Date,
        default: Date.now()
    }

})


module.exports = mongoose.model('Stock', StockPriceModel)