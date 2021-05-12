const { months } = require('moment');
const mongoose = require('mongoose');



const ParnumModel = new mongoose.Schema({
    Part: String,
    SKU_c: String,
    Description: String,
    PrecioWeb: Number

})


module.exports = mongoose.model('parnum', ParnumModel)