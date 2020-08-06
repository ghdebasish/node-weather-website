const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const weather = require('./utils/weather.js');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, '../templates/views');
const partialsDirectoryPath = path.join(__dirname, '../templates/partials');

// Setup view engine and view path
app.set('view engine', 'hbs');
app.set('views', viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);

// Setup static directory to server
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Debasish Ghosh'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Debasish Ghosh'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Debasish Ghosh',
        helptext: 'Debasish Ghosh is here to help you'
    });
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }

        weather(latitude, longitude, req.query.weathertype, (error, { current, forecast } = {}) => {
            if (error) {
                return res.send({ error });
            }

            if (req.query.weathertype == "current") {
                return res.send({
                    messageOne: 'Your location is : ' + location,
                    messageTwo: 'Outside is ' + current.weather_descriptions[0] + '. It is currently ' + current.temperature + ' degrees out. There is ' + current.precip + '% chance of rain.'
                });
            }
            else if (req.query.weathertype == "forecast") {
                const today = new Date().toISOString().split('T')[0];
                const forecastData = forecast[today];

                return res.send({
                    messageOne: 'Your location is : ' + location,
                    messageTwo: 'Today\'s max / min Temparature  is ' + forecastData.mintemp + ' / ' + forecastData.maxtemp
                });
            }
        });
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error',
        name: 'Debasish Ghosh',
        errortext: 'Help page not found'
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error',
        name: 'Debasish Ghosh',
        errortext: 'You are ended up with 404 page'
    });
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})