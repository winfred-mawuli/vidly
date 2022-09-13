const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config =require('config')
const morgan =require('morgan')
const helmet = require('helmet')
const logger =require('./middleware/logger')
const genres = require('./routes/genres')
const customers = require('./routes/customers');
const home = require('./routes/home')
const authenticate = require('./middleware/authenticating')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(helmet())
app.use('/api/genre', genres);
app.use('/api/customers', customers)
app.use('/', home);

mongoose.connect('mongodb://localhost/vidly')
.then(()=> dbDebugger('Connected to MongoDB.....'))
.catch(err=> dbDebugger('Could not connect to MongoDB....'));



app.set('view engine', 'pug');
app.set('views', './views'); //default
//configuration
console.log('Application Name:'+ config.get('name'));
console.log('Mail Server:'+ config.get('mail.host'));
console.log('Mail Password:'+ config.get('mail.password')); 

if(app.get('env')==='development'){
  app.use(morgan('tiny'))
  debug('Morgan Enabled.....')
}

app.use(logger)
app.use(authenticate)












app.listen(port, () => console.log(`App listening on port ${port}!`));


