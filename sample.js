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

//routes
app.get('/', function(req, res) {

    // Place holders for Yelp Fusion's OAuth 2.0 credentials. Grab them
    // from https://www.yelp.com/developers/v3/manage_app
    const clientId = 'b2O99xfc1XALotIer3f_JQ';
    const clientSecret = 'XOddj1IikQTtwZBEGrSb1AkS6KGeQFEFTShgrO7chQsLJ79ffnNJhFboKufMgdpa';

    const searchRequest = {
        term: 'Four Barrel Coffee',
        location: 'san francisco, ca'
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

//have our app listen on port 3000
app.listen(3000);
console.log('Your app is now running at: http://127.0.0.1:3000/');
