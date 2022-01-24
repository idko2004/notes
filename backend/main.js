const express = require('express');
const bodyParser = require('body-parser');
const rand = require('generate-key');


const app = express();
const port = 3000;

const jsonParser = bodyParser.json();

const urlEncodedParser = bodyParser.urlencoded({extended: false});

let sessionIDList = {};

app.options('/', function(req, res)
{

});

app.get('/', function(req, res)
{
    res.send('Hola, funciono y eso');
});

app.get('/get-sessionID', function(req, res)
{
    let key = rand.generateKey(7);
    //sessionIDList[key] = req.body.username;

    let body = {sessionID: key};
    res.send(JSON.stringify(body));
});

app.listen(port, function()
{
    console.log('Servidor inciado en el puerto', port);
});