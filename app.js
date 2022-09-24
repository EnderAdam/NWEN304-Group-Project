const express = require('express');
const path = require("path");
const http = require("http");

const indexRouter = require('./routes/indexRouter');
const apiRouter = require('./routes/apiRouter');
const productRouter = require('./routes/productRouter');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/products', productRouter);

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

// passport config
const Account = require('./models/account');
// passport.use(new LocalStrategy(Account.authenticate()));
// passport.use(new LocalStrategy(Account.authenticate(), function (username, password, done) {
//     Account.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) {
//             return done(null, false, { message: 'Incorrect username.' });
//         }
//         if (!user.validPassword(password)) {
//             return done(null, false, { message: 'Incorrect password.' });
//         }
//         return done(null, user);
//     }).catch(err => done(err));
// }), function (req, res) {
//     res.redirect('/');
// });
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://dbUser:c43&B6HD6^oT2L^@nwen304project.utzxtry.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

server = http.createServer(app);
server.listen(3000);