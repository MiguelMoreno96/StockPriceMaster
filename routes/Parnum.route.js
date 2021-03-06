const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {createParnum, createOneParnum, getOneParnumRegisterById, getOneParnumRegister, getAllParnumRegister, putOneRegister, getOneParnumRegisterBySku,findAllinformationProduct} = require('../controllers/Parnum.controller')
//const {findAllinformationProduct} =require('../controllers/ParnumSku.controller')



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
    .post(excel,createParnum);

router.route('/CreateNewParnum').post(createOneParnum);
router.route('/findById/:id').get(getOneParnumRegisterById);
router.route('/findByParnum/:parnum').get(getOneParnumRegister);
router.route('/getAllRegister').get(getAllParnumRegister);
router.route('/updateParnum/:id').put(putOneRegister);
router.route('/findBySku/:sku').get(getOneParnumRegisterBySku);

/*------------------------------------------------------*/

router.route('/FindProductSkuParnum/:sku').get(findAllinformationProduct);
module.exports = router;