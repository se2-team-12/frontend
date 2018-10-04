var express = require('express'),


  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Heartbeat = require('./api/models/swe2ApiModel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/swe2'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routes = require('./api/routes/swe2ApiRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Gateway RESTful API server started on: ' + port);