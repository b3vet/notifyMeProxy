
var express = require('express'),
    bodyParser = require('body-parser'),
    axios = require('axios'),
    app = express();

app.use(bodyParser.json());

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://b3vet.github.io");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        res.send();
    } else {
        let targetURL = req.header('Target-URL');
        if (!targetURL) {
            res.status(500).send({ error: 'There is no Target-URL header in the request' });
            return;
        }
        if (!targetURL.includes("http")) {
            targetURL = `https://${targetURL}`;
        }
        axios.get(targetURL).then((response) => {
            res.status(response.status).send(response.data);
        }).catch((error) => {
            res.status(400).send({error})
        })
    }
});

app.set('port', process.env.PORT || 3100);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
