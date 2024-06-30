var express = require('express');
var glob = require('glob');
var morgan = require('morgan');
var winston = rootRequire('config/winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
var flash = require('connect-flash');
var csrf = require('csurf');
var helmet = require('helmet');
let RedisStore = require('connect-redis')(session);
let redisClient = rootRequire('config/redisClient');
let sanitizeMiddleWare = rootRequire('app/middlewares/sanitizeInputsMIddleware');
var crypto = require('crypto');
const { passport } = rootRequire('config/passport');

module.exports = function (app, config) {
  var env = config.env;
  
  var baseUrlPrefix = config.baseUrl || '';
  global.baseUrlPrefix = baseUrlPrefix;
  app.locals.baseUrlPrefix = baseUrlPrefix;

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  var sesObj = {
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    proxy: true,
    cookie: {
      expires: config.sessionLife || 900000,
      domain: config.cookieDomain || 'localhost',
      sameSite: true,
      secure: config.secureCookies
    },
    resave: false,
    rolling: true,
    // store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    genid: function (req) {
      return 'Sid-' + Math.random(0, 9999) + crypto.createHash('sha256').update(uuidv4()).update(crypto.randomBytes(256)).digest("hex");
    }
  };

  app.use(express.static(config.root + '/public'));
  app.use('/uploads',express.static(config.root + "/uploads"));
  app.use(cookieParser());
  app.use(session(sesObj));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
  // app.use(helmet());
  // app.use(helmet.dnsPrefetchControl());
  // app.use(helmet.frameguard());
  // app.use(helmet.hidePoweredBy());
  // app.use(helmet.hsts());
  // app.use(helmet.ieNoOpen());
  // app.use(helmet.noSniff());
  // app.use(helmet.permittedCrossDomainPolicies());
  // app.use(helmet.referrerPolicy({policy: "origin-when-cross-origin"}));

  // app.use(helmet.xssFilter());
  // app.use(function (req, res, next) {
    // res.setHeader('X-XSS-Protection', '1;mode=block');
    // res.setHeader('Cross-origin-Embedder-Policy', 'require-corp');
    // res.setHeader('Access-Control-Allow-Origin', `${req.protocol}://${req.hostname}`);
    // next();
  // });

  app.use(function (req, res, next) {
    if (csrfExclusion.indexOf(req.path) == -1 && ('HEAD' == req.method || 'OPTIONS' == req.method)) return next();
    // break session hash / force express to spit out a new cookie once per second at most
    req.session._garbage = Date();
    req.session.touch();
    res.locals.session = req.session;
    res.locals.errors = req.flash('errors');
    res.locals.Success = req.flash('Success');
    next();
  });
  
  app.set('views', [config.root + '/app/views']);
  app.set('view engine', 'ejs');
  
  //app.use(favicon(config.root + '/public/img/favicon.ico'));
  
  app.use(morgan('combined'));
  app.use(bodyParser.json({ limit: '40mb' }));
  app.use(bodyParser.urlencoded({ limit: '40mb', extended: true, parameterLimit: 1000000 }));
  
  var csrfExclusion = ['/app/login/callback'];

  var conditionalCSRF = function (req, res, next) {  
    if (csrfExclusion.indexOf(req.path) !== -1){
      next();
    }
    else{
      csrf()(req, res, next);
    }
  }

  app.use(conditionalCSRF);
  app.use(compress());
  app.use(methodOverride());

  app.use(function (req, res, next) {
    if (csrfExclusion.indexOf(req.path) == -1 && (!req.headers['xsrf-token'] || !req.cookies['XSRF-TOKEN'])) {
      var csrfToken = req.csrfToken()
      // res.cookie('XSRF-TOKEN', csrfToken);
      res.locals.csrfToken = csrfToken;
      next();
    } else {
      res.locals.csrfToken = req.headers['xsrf-token'] || req.cookies['XSRF-TOKEN'];
      next();
    }
  })

  app.use(sanitizeMiddleWare());
  
  var routes = glob.sync(config.root + '/app/routes/*.js');
  routes.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    // add this line to include winston logging
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.render('error', {
      message: '',
      error: {},
      title: 'error'
    });
  });
  
};