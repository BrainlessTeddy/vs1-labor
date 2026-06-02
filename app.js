// File origin: VS1LAB A3

/**
 * Define module dependencies.
 */
const GeoTagStore = require('./models/geotag-store');
const GeoTagExamples = require('./models/geotag-examples');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const indexRouter = require('./routes/index');

/**
 * Set up Express app.
 */
const app = express();

// Set ejs as the view engine.
app.set('views', path.join(__dirname, 'views'));

// Set ejs template folder.
app.set('view engine', 'ejs');

// Set logger
app.use(logger('dev'));

// Set content processing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * VS1LAB:
 * Configure path for static content.
 * Test the result in a browser here: 'http://localhost:3000/'.
 */
// Statisch daten
app.use(express.static(path.join(__dirname, 'public')));

// Zentralen Store erstellen
const store = new GeoTagStore();
const examples = GeoTagExamples.getGeoTagsAsObj();
examples.forEach(gt => store.addGeoTag(gt));
console.log(`Store populated with ${store.count()} geotags`);
app.locals.geoTagStore = store;
app.use('/', indexRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
