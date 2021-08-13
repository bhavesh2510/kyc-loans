var express = require("express");
const cors = require('cors');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var fileUpload = require('express-fileupload');

const port = process.env.PORT || 30000;

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    
    // Pass to next layer of middleware
    next();
});

app.use(cors({origin : '*'}))

//set folder public as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));

app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
}));

const user = require(__dirname + '/routes/users');
app.use('/api', user);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
