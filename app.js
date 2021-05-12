const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./config/db');


dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();


app.use(cors({origin: true, credentials: true}));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/api/v1/stock', require('./routes/StockPrice.route'))
app.use('/api/v1/user', require('./routes/User.route'))
app.use('/api/v1/parnum', require('./routes/Parnum.route'))
app.use('/api/v1/login', require('./routes/auth.route'))

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`server is running on port: ${PORT}`.green))
