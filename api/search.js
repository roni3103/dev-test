const config = require('../config/development');
const axios = require('axios');
const winston = require('winston');

const logConfiguration = config.loggerConfig;
const logger = winston.createLogger(logConfiguration);

getAllUsers = async (req, res) => {
    try {
      const allUsers = await axios.get(config.allUsersURL);
      return allUsers.data;
    } catch (err) {
        console.log(err);
        logger.log({
            message: 'There was an error processing get all users',
            level: 'error'
        })
    }
}

getLondonUsers = async (req, res) => {
    try {
      const londonUsers = await axios.get(config.londonersURL);
      return londonUsers.data;
    } catch (err) {
        logger.log({
            message: err,
            level: 'error'
        })
        res.status(500).send({
            message: err.message
        })
    }
}

module.exports = {
    getAllUsers,
    getLondonUsers
}