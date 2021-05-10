const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {createParnum, createOneParnum, getOneParnumRegisterById, getOneParnumRegister, getAllParnumRegister, putOneRegister } = require('../controllers/Parnum.controller')



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

module.exports = router;