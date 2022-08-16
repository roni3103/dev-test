const express = require('express');
const app = express();
const search = require('./api/search');
const config = require('./config/development');

// SETUP LOGGING
const winston = require('winston');
const logConfiguration = {
    'transports': [
       new winston.transports.Console()
    ] 
  };
const logger = winston.createLogger(logConfiguration);


// ROUTES
app.get('/', async (req, res) => {   
    // Combine the calls
    try {
        const allUsers = await search.getAllUsers(req, res);
        const londonUsers = await search.getLondonUsers(req, res);
        const usersWithinDistance = search.findUsersWithinDistance(allUsers, config.londonLatLon);
        const combinedLondonAndWithinFifty = search.combineUsers(londonUsers, usersWithinDistance);
        res.send(combinedLondonAndWithinFifty);
      } catch (err) {  
          res.status(500).send({
              message: err.message
          })
    }  
});

app.get('/all-users', async (req, res) => {   
    // make call to api 
    try {
        const allUsers = await search.getAllUsers(req, res);
        res.send(allUsers);
      } catch (err) {
          res.status(500).send(err)
    }
    
});

app.get('/london-users', async (req, res) => {
    // make call to api 
    try {
        const londonUsers = await search.getLondonUsers(req, res);
        res.send(londonUsers);
      } catch (err) {
          res.status(500).send(err)
    }
    
})

app.get('/version',(req, res) => {
    try {
        res.send(process.env.npm_package_version)
    } catch (err) {
        res.status(500).send(err)
    }
}) 

// EXPORTED HERE SO THAT TESTS RUN ON THEIR OWN SERVER WITHOUT PORT CONFLICTS
module.exports = app
