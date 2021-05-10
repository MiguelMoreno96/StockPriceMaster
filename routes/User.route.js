const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {createNewUser,consultUser,consultAllUsers,updateUser,deleteUser,deleteUserByEmail,updateUserByEmal} = require('../controllers/User.controller');

router.route('/createUser').post(createNewUser);
router.route('/ConsultarUsuario/:email').get(consultUser);
router.route('/consultAllUsers').get(consultAllUsers);
router.route('/UpdateUser/:id').put(updateUser);
router.route('/UpdateUserByEmail/:email').put(updateUserByEmal);
router.route('/DeleteOneUser/:id').delete(deleteUser);
router.route('/DeleteOneUserByEmail/:email').delete(deleteUserByEmail);

module.exports = router;