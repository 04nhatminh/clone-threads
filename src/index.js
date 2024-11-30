const express = require('express');
const app = express();
const route = require('./routes');
const path = require('path');
const expressHbs = require('express-handlebars');
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.engine(
    'hbs', 
    expressHbs.engine({
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        extname: 'hbs',
        defaultLayout: 'main',
    })
);

app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));

route(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

