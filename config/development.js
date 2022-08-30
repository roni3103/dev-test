const baseUrl = "https://dwp-techtest.herokuapp.com";
const winston = require('winston');

module.exports = {
    port: 5020,
    certConfig: {
      CA: '/etc/ssl/certs/ca-certs.pem'  
    },
    loggerConfig: {
      'transports': [
         new winston.transports.Console()
      ] 
    },
    allUsersURL: `${baseUrl}/users`,
    londonersURL: `${baseUrl}/city/London/users`,
    londonLatLon : { lat: 51.5074, lon: -0.1277 },
    GENERIC_ERROR_MESSAGE: 'Internal error please raise incident'

}