const express = require('express');
const path = require("path");
const http = require("http");

const indexRouter = require('./routes/indexRouter');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


server = http.createServer(app);
server.listen(3000);