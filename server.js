var express = require('express'),
    bodyParser = require('body-parser'),
    axios = require('axios'),
    app = express();

app.use(bodyParser.json());

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "https://b3vet.github.io");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.status(500).send({ error: 'There is no Target-URL header in the request' });
            return;
        }
        axios.get(targetURL, {
            body: req.body,
            headers: req.header('Authorization') ? {'Authorization': req.header('Authorization')} : {}
        }).then((response) => {
            res.send(response)
        }).catch((error) => {
            console.error(`error: ${error}`)
            res.status(400).send({error})
        })
    }
});

app.set('port', process.env.PORT || 3100);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
