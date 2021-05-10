const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {createNewUser,consultUser} = require('../controllers/User.controller');

router.route('/createUser').post(createNewUser);
router.route('/ConsultarUsuario/:email').get(consultUser);

module.exports = router;