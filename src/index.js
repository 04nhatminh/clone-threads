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
            }
        }
    })
);

app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));

// Cau hinh doc du lieu gui theo phuong thuc POST
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

