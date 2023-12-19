const express = require('express');
const app = express();
const userRoute = require('./routes/userRoute');
require('dotenv').config();
const dbConnect = require('./config/dataBase');

//.................middelwares for read req.body........................./

app.use(express.json());

//.................middelwares for read req.body........................./

app.use(express.cookie());

//..........................port number.................................../

const PORT = process.env.PORT || 5678;

//...............................mounting............................./

app.use('/api/v1', userRoute);

//...............................dbconnect................................./
dbConnect();

//................................/activated server........................../

app.listen(PORT, () => {
	console.log(`server started at port number ${PORT}`);
});
