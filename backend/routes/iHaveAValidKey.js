const database = require('../database');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/iHaveAValidKey', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/iHaveAValidKey\033[0m');
        console.log('body',req.body);

        //Vemos si tienemos los datos necesarios
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('BadRequest: no body');
            return;
        }

        const key = req.body.key;

        if(key === undefined)
        {
            res.status.send(200).send({iHaveAValidKey: 'noYouDont'});
            return;
        }

        const keyData = await database.getKeyData(key);

        if(keyData === null)
        {
            res.status(200).send({iHaveAValidKey: 'noYouDont'});
            return;
        }
        res.status(200).send({iHaveAValidKey: 'yesYouHave'});
    });
}