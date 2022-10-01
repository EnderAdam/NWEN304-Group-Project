const express = require('express');
const path = require("path");
const http = require("http");
const session = require('express-session');
const MongoDBStore = require('express-mongodb-session')(session);
const passport = require('passport');
const mongoose = require('mongoose');

const indexRouter = require('./routes/indexRouter');
const apiRouter = require('./routes/apiRouter');
const productRouter = require('./routes/productRouter');
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
    cookie: {secure: false},
    store: new MongoDBStore({
        uri: mongoDB,
        collection: 'sessions'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/products', productRouter);

passport.use(Account.createStrategy());
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