'use strict';
var express = require('express'),
    path = require('path');
const yelp = require('yelp-fusion');

//create our express app
var app = express();

//add some standard express middleware
app.configure(function() {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.static('static'));
});
app.use(function(req, res, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, zip, price");
    next();
});


//routes
app.get('/', function(req, res, next) {

    // Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
    // from https://www.yelp.com/developers/v3/manage_app
    const clientId = 'b2O99xfc1XALotIer3f_JQ';
    const clientSecret = 'XOddj1IikQTtwZBEGrSb1AkS6KGeQFEFTShgrO7chQsLJ79ffnNJhFboKufMgdpa';

    const searchRequest = {
        // location: req.get("zip"),
        // price: req.get("price")
        location: 21093,
        price: 3
    };

    yelp.accessToken(clientId, clientSecret).then(response => {
        const client = yelp.client(response.jsonBody.access_token);

        client.search(searchRequest).then(response => {
            res.send(response.jsonBody);
        });
    }).catch(e => {
        console.log(e);
    });
});

app.set("port", (process.env.PORT || 3000));
app.listen(app.get("port"));
console.log('Your app is now running at: ' + app.get("port"));
