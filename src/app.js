const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const weather = require('./utils/weather.js');

const app = express();

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

        weather(latitude, longitude, 'current', (error, { current } = {}) => {
            if (error) {
                return res.send({ error });
            }

            res.send({
                forecast: current.weather_descriptions[0],
                location: location,
                temperature: current.temperature,
                rain: current.precip
            });

        });
        //weather(latitude, longitude, 'forecast', getWeatherForcast)

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

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})