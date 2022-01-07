const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var expressHbs =  require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const moment = require('moment');
const csrf = require('csurf');
const mongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const indexRouter = require('./routes');
const fdsRouter = require('./components/fds');
const personsRouter = require('./components/persons');

const app = express();

require('./config/passport');

const hbs = expressHbs.create({
  defaultLayout: 'layout', 
  extname: '.hbs',
  helpers: {
    if_even: function(conditional, options) {
      if((conditional % 2) == 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    times: function(n, block) {
      var accum = '';
      for(var i = 1; i < n + 1; ++i) {
        accum += block.fn(i);
      }
      
      return accum;
    },
    timesWithConst: function(n, constant, block) {
      var accum = '';
      for(var i = 1; i < n + 1; ++i) {
        accum += block.fn(i + " " + constant);
      }
      
      return accum;
    },
    getSplit: function(string, split, n) {
      return (string.split(split))[n];
    },
    for: function(from, to, incr, block) {
      var accum = '';
      for(var i = from; i < to; i += incr)
          accum += block.fn(i);
      return accum;
    },
    dateFormat: function (date, options) {
      const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD/MM/YYYY"
      return moment(date).format(formatToUse);
    },
    price: function (number) { return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') },
    compare: function(lvalue, rvalue, options) {

      if (arguments.length < 3)
          throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  
      var operator = options.hash.operator || "==";
  
      var operators = {
          '==':       function(l,r) { return l == r; },
          '===':      function(l,r) { return l === r; },
          '!=':       function(l,r) { return l != r; },
          '<':        function(l,r) { return l < r; },
          '>':        function(l,r) { return l > r; },
          '<=':       function(l,r) { return l <= r; },
          '>=':       function(l,r) { return l >= r; },
          'typeof':   function(l,r) { return typeof l == r; }
      }
  
      if (!operators[operator])
          throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
  
      var result = operators[operator](lvalue,rvalue);
  
      if( result ) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
  
    },
    splitAndCompare: function(value, p, options) {
      const split = value.split(p);
      const lvalue = split[0];
      const rvalue = split[1];

      if (arguments.length < 2)
          throw new Error("Handlerbars Helper 'splitAndCompare' needs 2 parameters");
  
      var operator = options.hash.operator || "==";
  
      var operators = {
          '==':       function(l,r) { return l == r; },
          '===':      function(l,r) { return l === r; },
          '!=':       function(l,r) { return l != r; },
          '<':        function(l,r) { return l < r; },
          '>':        function(l,r) { return l > r; },
          '<=':       function(l,r) { return l <= r; },
          '>=':       function(l,r) { return l >= r; },
          'typeof':   function(l,r) { return typeof l == r; }
      }
  
      if (!operators[operator])
          throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
  
      var result = operators[operator](lvalue,rvalue);
  
      if( result ) {
          return options.fn(this);
      } else {
          return options.inverse(this);
      }
  
    }
  }
});

// view engine setup
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({ 
  secret: 'admin.fdshop', 
  resave: false, 
  saveUninitialized: false,
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { 
    maxAge: 180 * 60 * 1000,
    secure: false 
  }
}));

app.use(csrf({ cookie: true }));
app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use('/', indexRouter);

app.use('/dashboard', indexRouter);

app.use('/', personsRouter);
app.use('/register', personsRouter);
app.use('/up', personsRouter);
app.use('/profile', personsRouter);
app.use('/logout', personsRouter);
app.use('/list', personsRouter);

// for fds
app.use('/', fdsRouter);
app.use('/product-list', fdsRouter);
app.use('/product-details', fdsRouter);
app.use('/add-fd', fdsRouter);
app.use('/update-fd', fdsRouter);
app.use('/delete-fd', fdsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
