const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    credentials: true
};
const uuidv4 = require('uuid/v4');

const port = process.env.PORT || 8080;
const app = express();

let name = '';
const scores = [];

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).send({
            errorCode: 'PARSE_ERROR',
            message: 'Arguments could not be parsed, make sure request is valid.'
        });
    } else {
        res.status(500).send('Something broke server-side.', error);
    }
});

app.get('/', function(req, res) {
    res.send('Welcome to our Simon Game !');
});

app.post('/name', function(req, res) {
    name = req.body.name;

    return res.status(200).send(JSON.stringify({'name': req.body.name}));
});

app.get('/scores', function(req, res) {
    const scores = getScores();

    return res.status(200).send(JSON.stringify({'scores': scores}));
});

app.post('/scores', function(req, res) {
        ensureValidScore(req.body, res, function() {
            const score = {name: name, score: req.body.score};
            scores.push(score);

            return res.status(200).send(JSON.stringify(score));
    });

});

app.listen(port, function() {
    console.log('Server listening.')
});

function ensureValidScore(score, res, callback) {
    if (score.name === undefined || score.score === '') {
        return res.status(400).send('Score definition is invalid.');
    }

    callback();
}

function getScores() {
    return scores || [];
};