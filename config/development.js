const baseUrl = "https://dwp-techtest.herokuapp.com"
module.exports = {
    certConfig: {
      CA: '/etc/ssl/certs/ca-certs.pem'  
    },
    allUsersURL: `${baseUrl}/users`,
    londonersURL: `${baseUrl}/city/London/users`,
    londonLatLon : { lat: 51.5074, lon: -0.1277 }

}