/*
Authenticate on the v2 version of the Harvest API
 */
const express           = require('express');
const session           = require('express-session');
var FileStore           = require('session-file-store')(session);
const grant             = require('grant-express');
const request           = require('request');

module.exports = function(data,callback) {
    const app = express();
    
    var fileStoreOptions = {};

    app.use(session({
        store: new FileStore(fileStoreOptions),
        secret: data.APP_SECRET, 
        saveUninitialized: true, 
        resave: true
    }));

    app.use(grant({
        defaults: {
            protocol: data.PROTOCOL,
            host: data.HOST
        },
        harvestv2: {
            "authorize_url": "https://id.getharvest.com/oauth2/authorize",
            "access_url": "https://id.getharvest.com/api/v2/oauth2/token",
            "oauth": 2,
            key: data.CLIENT_ID,
            secret: data.CLIENT_SECRET,
            "callback": "/auth/harvestv2"
        }
    }));

    app.get('/auth/harvestv2', (req, res) => {

        const options = {
            url: 'https://id.getharvest.com/api/v2/accounts',
            headers: {
                'Authorization': 'Bearer ' + req.query.access_token,
                'User-Agent': data.APP_NAME
            },
            json:true
        };

        request(options, (qerr, qres, qbody) => {

            if (qerr) {
                res.send("Error requsting harvest accounts: "+qerr);
                return console.log(qerr);
            }

            callback(req, res, {tokens: req.query, accounts: qbody});
        });
    });

    return app;
};
