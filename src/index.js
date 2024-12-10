const express = require('express');
const app = express();
const route = require('./routes');
const path = require('path');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const redisStore  = require('connect-redis').default;
const { createClient } = require('redis');
const bodyParser = require('body-parser');
const port = 3000;

const redisClient = createClient({
    url: 'rediss://red-ct8uaq5ds78s73ch9d50:jsCk4S0kocDWyBVza0v97HBm72d0aMIl@singapore-redis.render.com:6379'
});
redisClient.connect().catch(console.error);

const passport = require('./controllers/passport');
const flash = require('connect-flash');

app.use(express.static(path.join(__dirname, 'public')));

app.engine(
    'hbs', 
    expressHbs.engine({
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
        extname: 'hbs',
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
        helpers: {
            formatDate: (date) => {
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
            },
        }
    })
);

app.set('view engine', '.hbs');

app.use(
    session({
        secret: 's3cret',
        store: new redisStore({ client: redisClient }), // Dùng RedisStore với Redis client
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 20 * 60 * 1000, // Cookie hết hạn sau 20 phút
        },
    })
);
// //cau hinh su dung passport
app.use(passport.initialize());
app.use(passport.session());
//cau hinh su dung connect-flash
app.use(flash());
//midleware
app.use((req, res, next) =>{
    res.locals.isLoggedIn = req.isAuthenticated();
    next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));

route(app);

app.get("/profile", (req, res) => {
    res.render("profile", {
        title: "Profile",
        isProfile: true,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

