const request = require('request');

const weather = (latitude, longitude, weatherType, callback) => {
    // weathertype : current, historical, forecast
    const baseURL = 'http://api.weatherstack.com/' + weatherType;
    const accessKey = 'access_key=7bb9a4112cc6051a0d4e5e95570934c5';
    const url = baseURL + '?' + accessKey + '&query=' + latitude + ',' + longitude;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to the weather service!', null);
        } else if (body.error) {
            callback(body.error.info, null);
        } else {
            callback(null, body);
        }
    });
}

module.exports = weather;