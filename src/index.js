const express = require('express');
const app = express();
const route = require('./routes');
const path = require('path');
const expressHbs = require('express-handlebars');
require('dotenv').config()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

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
            getDifTime: (date) => {
                const diffTime = Math.abs(new Date() - date);
                const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                const hours = Math.floor(diffTime / (1000 * 60 * 60));
                const minutes = Math.floor(diffTime / (1000 * 60));
                const seconds = Math.floor(diffTime / 1000);
                if (days > 365) {
                    return `${Math.floor(days / 365)} years ago`;
                } else if (days == 1) {
                    return `${days} day ago`;
                } else if (days > 0) {
                    return `${days} days ago`;
                } else if (hours > 0) {
                    return `${hours} hours ago`;
                } else if (minutes > 0) {
                    return `${minutes} minutes ago`;
                } else {
                    return `${seconds} seconds ago`;
                }
            },
            breaklines: (text) => {
                return text.replace(/\n/g, '<br>');
            },
            includes: (array, value) => {
                return array.includes(value);
            },
            extractDomain: (url) => {
                try {
                    const { hostname } = new URL(url);
                    return hostname.split('.').slice(0, -1).join('.') + '.' + hostname.split('.').pop().substring(0, 3);
                } catch (error) {
                    return url; 
                }
            },
            timeAgo: (date) => {
                const seconds = Math.floor((new Date() - new Date(date)) / 1000);
                const intervals = {
                    year: 31536000,
                    month: 2592000,
                    week: 604800,
                    day: 86400,
                    hour: 3600,
                    minute: 60
                };
                for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                    const interval = Math.floor(seconds / secondsInUnit);
                    if (interval >= 1) {
                        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
                    }
                }
                return 'Just now';
            }
        }
    })
);

app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));

// Cau hinh doc du lieu gui theo phuong thuc POST
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cau hinh doc ghi cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());

route(app);

app.use((req, res) => {
    res.status(404).send("Request NOT Found!");
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).send(`${error}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

