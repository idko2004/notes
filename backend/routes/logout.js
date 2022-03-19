const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');

module.exports = function(app)
{
    app.post('/logout', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/logout');
        console.log('body',req.body);

        //Comprobamos si tenemos las cosas
        if(req.body === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        const key = req.body.key;

        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Obtener la key
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }

        //Borrar la la key
        await database.deleteElement('sessionID', {key});
        delete database.sessionIDList[key];

        //Responder al cliente
        res.status(200).send({ok: true});
    });
}