const express = require('express');
const app = express();
const config = require('./config/development');
const axios = require('axios');
const winston = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.Console()
    ]
};
const logger = winston.createLogger(logConfiguration);


// const search = require('./api/search');

// THIS GOING TO SEARCH
getAllUsers = async () => {
    try {
      const allUsers = await axios.get(config.allUsersURL);
      return allUsers.data;
    } catch (err) {
        logger.log({
            message: err,
            level: 'error'
        })
    }
}

app.get('/', async (req, res) => {   
    // make call to api 
    try {
        const allUsers = await getAllUsers();
        res.send(allUsers);
      } catch (err) {
          res.status(500).send('There was an error getting all users')
    }
    
});

app.get('/version',(req, res) => {
    try {
        res.send(process.env.npm_package_version)
    } catch (err) {
        res.status(500).send(err)
    }
}) 

module.exports = app
