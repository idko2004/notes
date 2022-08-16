const database = require('../database');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/iHaveAValidKey', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/iHaveAValidKey\033[0m');
        console.log(logID, 'body',req.body);

        //Vemos si tienemos los datos necesarios
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'BadRequest: no body');
            return;
        }

        const key = req.body.key;

        if(key === undefined)
        {
            res.status.send(200).send({iHaveAValidKey: 'noYouDont'});
            console.log(logID, 'you dont have a valid key, you dont even have a key');
            return;
        }

        const keyData = await database.getKeyData(key);

        if(keyData === null)
        {
            res.status(200).send({iHaveAValidKey: 'noYouDont'});
            console.log(logID, 'you dont have a valid key');
            return;
        }
        res.status(200).send({iHaveAValidKey: 'yesYouHave'});
        console.log(logID, 'yes you have a valid key');
    });
}
