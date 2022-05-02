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

    app.post('/logoutalldevices', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/logoutalldevices');
        console.log('body',req.body);

        //Comprobar si tenemos los datos necesarios
        //  key
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest - no body');
            return;
        }
        
        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest - no key');
            return;
        }

        //Obtener el correo electrónico
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log('error - invalidKey');
            return;
        }
        const email = keyData.email;
        if(email === undefined)
        {
            res.status(500).send({error: 'invalidKey'});
            console.log('error - somehow the key has no email');
            return;
        }

        //Borrar todos los elementos en sessionID que tengan ese correo electrónico
        console.log('Borrando todas las key');
        await database.deleteMultipleElements('sessionID', {email});
        database.resetSessionIDList();
        console.log('Keys borradas');

        //Responder al cliente
        res.status(200).send({ok: true});
    });
}