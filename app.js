//Brought on board depedencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database); 

//On connection
mongoose.connection.on('connected' , () => {
    console.log('Connected to database' + config.database);
});

//On error
mongoose.connection.on('error' , () => {
    console.log('Database error:' + config.database);
});


const app = express();

//Bring on board users folder which has routes
const users = require('./routes/users');

//Port Number
const port = process.env.PORT || 8080;

//CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))


//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Any route having /users will go to the users route we imported at the top
app.use('/users' , users);

//Index route
app.get('/' , (req, res) =>{
    res.send('Invalid Endpoint');
});

app.get('*' , (req, res) => {
    res.sendFile(path.join(__dirname , 'public/index.html' ))
});

//Start Server
app.listen(port, () => {
    console.log('Server started on port' + port);
});