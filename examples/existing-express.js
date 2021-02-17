const express           = require('express');
const harvestAuth       = require('harvest-auth');

let app             = express();
const port          =  3000;

app.use(harvestAuth({
    APP_NAME: "FILL IN HERE",
    APP_SECRET: "keyboard cat",
    PROTOCOL: "http",
    HOST: "localhost:3000",
    CLIENT_ID: 'FILL IN HERE',
    CLIENT_SECRET: 'FILL IN HERE'
    },
    function(res, data) {
        // callback after authentication
        console.log(data);
        res.send(JSON.stringify(data, null, 2));
    }
));

app.listen(port);
console.log('Express is listening on port ' + port);

// navigate to https://localhost:3000/connect/harvestv2 to trigger the oAuth flow
