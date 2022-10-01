const express = require('express');
const path = require("path");
const http = require("http");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash');

const indexRouter = require('./routes/indexRouter');
const apiRouter = require('./routes/apiRouter');
const productRouter = require('./routes/productRouter');
const Account = require('./models/account');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    // cookie: {secure: true}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/products', productRouter);

authUser = (user, password, done) => {
    let authenticatedUser = Account.authenticate();
    authenticatedUser(user, password, (err, result) => {
            if (err) {
                return done(err);
            }
            if (!result) {
                return done(null, false, {message: 'Incorrect username or password.'});
            }
            return done(null, result);
        }
    );
}

passport.use(new LocalStrategy(authUser));
// passport.use(Account.createStrategy());
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser((userObj, done) => {
    Account.findById(userObj._id, (err, user) => {
        done(err, user);
    });
});

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

// Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://dbUser:c43&B6HD6^oT2L^@nwen304project.utzxtry.mongodb.net/database?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

server = http.createServer(app);
server.listen(process.env.PORT || 3000)