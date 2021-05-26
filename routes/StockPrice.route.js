const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createStockPrice, searchSku, updateStock, searchChannel, searchDate, searchDateRange, getindex, getMasterSearch, searchMasterChannelSku,searchMasterSkuDateRange, getAllStockPrice} = require('../controllers/StockPrice.controller')



const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/docs'),
    filename: (req, file, cb, filename) => {
        console.log(file.originalname);
        cb(null, file.originalname );
    }
})

const upload = multer({storage})
const excel = upload.single('file');


router.route('/')
    .get(searchSku)
    .post(excel,createStockPrice);

router.route('/Update/:id')
    .put(updateStock);

router.route('/Buscar/:sku').get(searchSku);
router.route('/all').get(getAllStockPrice);

router.route('/search/:Seller').get(searchChannel);

router.route('/searchDate/:createAt').get(searchDate);
router.route('/DateRange/:start&:end').get(searchDateRange);
//router.route('/searchMaster/:start&:end').get(searchDateRange);
//router.route('/searchMaster/:Seller').get(searchChannel);

router.route('/searchMaster/:start&:end').get(getMasterSearch);
router.route('/searchMaster/:Seller').get(getMasterSearch);
router.route('/searchMasterSkuSheller/:Seller&:sku').get(searchMasterChannelSku)
router.route('/searchMasterSkuDateRange/:start&:end&:sku').get(searchMasterSkuDateRange)



module.exports = router;