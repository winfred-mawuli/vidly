const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const portNumber = require('debug')('app:PORT');
const config =require('config');
const morgan =require('morgan');
const responseTime = require('response-time');
const helmet = require('helmet');
const logger =require('./middleware/logger');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');
const authenticate = require('./middleware/authenticating');
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000



app.use(express.json());
app.use(responseTime())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(helmet())
app.use('/api/genre', genres);
app.use('/api/customers', customers)
app.use('/', home);
const dataBase= config.get('mail.dbName')
//Connecting to mongoDatabase

mongoose.connect(process.env.MONGO_URI)
.then(()=> dbDebugger('Connected to MongoDB.....'))
.catch(err=> dbDebugger('Could not connect to MongoDB....'));


// rendering a pug template engineer in reference to the homepage.
app.set('view engine', 'pug');
app.set('views', './views'); //default 
//configuration
console.log('Application Name:'+ config.get('name'));
console.log('Mail Server:'+ config.get('mail.host'));
 

//To display HTTP request logger
if(app.get('env')==='development'){
  app.use(morgan('tiny'))
  debug('Morgan Enabled.....')
}


app.use(logger)
app.use(authenticate)






app.listen(port, () => portNumber(`App listening on port ${port}!`));


