var express = require('express');
var app=express();
var cors = require('cors');
app.use(cors());
var PORT = process.env.PORT || 8000;
var apiController=require('./controllers/apiController');
apiController(app);
app.listen(PORT);