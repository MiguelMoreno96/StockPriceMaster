const express = require('express');
const router = express.Router();
const { login ,register} = require('../controllers/Auth.controller');

router.route('/login')
            .post(login);
router.route('/register').post(register);


module.exports = router;