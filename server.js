const express = require('express');
const app = express();

const winston = require('winston');
const logConfiguration = {
    'transports': [
       new winston.transports.Console()
    ] 
  };
const logger = winston.createLogger(logConfiguration);

const search = require('./api/search');

app.get('/', async (req, res) => {   
    // make call to api 
    try {
        const allUsers = await search.getAllUsers();
        res.send(allUsers);
      } catch (err) {  
          res.status(500).send({
              message: err.message
          })
    }
    
});

app.get('/all-users', async (req, res) => {   
    // make call to api 
    try {
        const allUsers = await search.getAllUsers();
        res.send(allUsers);
      } catch (err) {
          res.status(500).send({
              message: err.message
          })
    }
    
});

app.get('/london-users', async (req, res) => {
    // make call to api 
    try {
        const londonUsers = await search.getLondonUsers();
        res.send(londonUsers);
      } catch (err) {
          res.status(500).send({
              message: err.message
          })
    }
    
})

app.get('/version',(req, res) => {
    try {
        res.send(process.env.npm_package_version)
    } catch (err) {
        res.status(500).send(err)
    }
}) 

module.exports = app
