const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const { logger } = require('./util');
const routes = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'client', 'dist'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'client', 'dist')));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(logger);

app.use(routes);

module.exports = app;