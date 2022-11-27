const database = require('../utils/database');
const crypto = require('../utils/crypto');
const emailUtil = require('../utils/email');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/changeEmailCode', jsonParser, async function(req, res)
    {

    });
}