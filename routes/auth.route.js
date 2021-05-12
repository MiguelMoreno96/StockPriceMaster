const express = require('express');
const router = express.Router();
const { login } = require('../controllers/Auth.controller');

router.route('/')
            .post(login);


module.exports = router;