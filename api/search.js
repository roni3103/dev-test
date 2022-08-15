const express = require('express');
const app = express();

const config = require('../config/development');
const geolocation = require('./geolocation');

const axios = require('axios');

const _ = require("lodash");
const winston = require('winston');
const logConfiguration = config.loggerConfig;
const logger = winston.createLogger(logConfiguration);

getAllUsers = async (req, res) => {
    try {
      const allUsers = await axios.get(config.allUsersURL);
      return allUsers.data;
    } catch (err) {
        logger.log({
            message: 'There was an error processing get all users : ' + err.message,
            level: 'error'
        })
        res.status(500).send(err)
    }
}

getLondonUsers = async (req, res) => {
    try {
      const londonUsers = await axios.get(config.londonersURL);
      return londonUsers.data;
    } catch (err) {
        logger.log({
            message: 'There was an error getting London users : ' + err.message,
            level: 'error'
        })
        res.status(500).send(err)
    }
}

findUsersWithinDistance = (arr, locationToTest) => {
    var usersWithinFiftyMiles = [];
    // create a new latlon pairing from co-ords
    // add user to array if their coords are in 50 miles
    for (i=0; i<arr.length; i++) {
      // convert to number as some are passed as strings
      var newLatLon = {'lat': Number(arr[i].latitude), 'lon': Number(arr[i].longitude)}
      
      if(geolocation.isWithinFiftyMiles(locationToTest,newLatLon)) {
        usersWithinFiftyMiles.push(arr[i]);
      }
    }
    return usersWithinFiftyMiles;
  
  }
  
  combineUsers = (firstArray, secondArray) => {
    const combinedArray = _.unionWith(firstArray, secondArray,_.isEqual);
    return combinedArray;
  }
  
  filterAndCombineUsers =  async () => {
    let allUsers = await getAllUsers();
    let londonUsers = await getLondonUsers();
  
    const usersWithinDistance = findUsersWithinDistance(allUsers, config.londonLatLon);
    const combinedLondonAndWithinFifty = combineUsers(londonUsers, usersWithinDistance);
    return combinedLondonAndWithinFifty;
  }

module.exports = {
    getAllUsers,
    getLondonUsers,
    findUsersWithinDistance,
    combineUsers,
    filterAndCombineUsers
}