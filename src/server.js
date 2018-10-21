import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import getModels from './models';
import api from './routes/api';

getModels().then((models) => {
  if (!models) {
    console.log('Could not connect to database');
    return;
  }
  // Sync Database
  models.sequelize.sync().then(() => {
    console.log('Nice! Database looks fine');

    var app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(morgan('dev'));

    app.get('/', function (req, res) {
      res.send('Crypto Dashboard API Server.');
    });

    app.use('/api', api);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.json({
        error: 'Endpoint doesnt exist!'
      });
    });

    const port = 8080;
    

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))

  }).catch((err) => {
    console.log(err, 'Something went wrong with the Database Update!');
  });
});