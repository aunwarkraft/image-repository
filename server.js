const express = require('express');
const session = require('express-session');
const bodyParser= require('body-parser');

const app = express();

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb:27017/imagerepository', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'));
db.once('open', function() {
  console.log('Connected');
});

// parse application/json
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

// Express Session
app.use(
    session({
      secret: 'this is a secret',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({mongooseConnection: mongoose.connection}),
    }),
);

app.listen(8080, function() {
  console.log('listening on 8080');
});

// Passport middleware
const passport = require('./server/passport/setup');
app.use(passport.initialize());
app.use(passport.session());

// ----- Routes -----
require('./server/routes/user.route')(app);

module.exports = app;
