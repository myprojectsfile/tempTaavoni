var express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var apiController = require('./server/controllers/api.controller');
var uploadController = require('./server/controllers/upload.controller');
var app = express();

app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

// api routes
apiController(app);

// upload routes 
uploadController(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



//  Get port from environment and store in Express.
const port = process.env.PORT || '3000';
app.set('port', port);


// index route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const server = http.createServer(app);
server.listen(port, () => console.log(`1- Taavoni app running on localhost:${port}`));