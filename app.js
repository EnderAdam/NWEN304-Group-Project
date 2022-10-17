const express = require('express');
const path = require("path");
const http = require("http");
const session = require('express-session');
const MongoDBStore = require('express-mongodb-session')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

const indexRouter = require('./routes/indexRouter');
const apiRouter = require('./routes/apiRouter');
const productRouter = require('./routes/productRouter');
const accountRouter = require('./routes/accountRouter');
const Account = require('./models/account');

// Set up mongoose connection

const mongoDB = "mongodb+srv://dbUser:c43&B6HD6^oT2L^@nwen304project.utzxtry.mongodb.net/database?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'secret',
    cookie: {secure: false, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: "strict"},
    store: new MongoDBStore({
        uri: mongoDB,
        collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.auth = !!req.isAuthenticated();
    next();
});

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/products', productRouter);
app.use('/account', accountRouter);

passport.use(Account.createStrategy());
passport.use(new GoogleStrategy({
        // options for the google strategy in environment variables
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CLIENT_CALLBACK
    },
    function (accessToken, refreshToken, profile, cb) {
        Account.findOne({googleId: profile.id}, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                user = new Account({
                    username: profile.displayName,
                    googleId: profile.id
                });
                user.save(function (err) {
                    if (err) console.log(err);
                    return cb(err, user);
                });
            } else {
                return cb(err, user);
            }
        });
    }
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(function (req, res) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', {url: req.url});
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.json({error: 'Not found'});
        return;
    }

    res.type('txt').send('Not found');
});


server = http.createServer(app);
server.listen(process.env.PORT || 3000)