const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const route = require('./routes');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Routers
route(app);

// Global error handler.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('An error occurred. Please try again later.');
});

// Listen on pc port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});