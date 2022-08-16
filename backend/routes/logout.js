const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/logout', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/logout\033[0m');
        console.log(logID, 'body',req.body);

        //Comprobamos si tenemos las cosas
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no body');
            return;
        }

        const key = req.body.key;

        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no key');
            return;
        }

        //Obtener la key
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log(logID, 'invalidKey');
            return;
        }

        //Borrar la la key
        await database.deleteElement('sessionID', {key});
        delete database.sessionIDList[key];

        //Responder al cliente
        res.status(200).send({ok: true});
        console.log(logID, 'sesión cerrada');
    });

    app.post('/logoutalldevices', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/logoutalldevices\033[0m');
        console.log(logID, 'body',req.body);

        //Comprobar si tenemos los datos necesarios
        //  key
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest - no body');
            return;
        }
        
        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest - no key');
            return;
        }

        //Obtener el correo electrónico
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log(logID, 'error - invalidKey');
            return;
        }
        const email = keyData.email;
        if(email === undefined)
        {
            res.status(500).send({error: 'invalidKey'});
            console.log(logID, 'error - somehow the key has no email');
            return;
        }

        //Borrar todos los elementos en sessionID que tengan ese correo electrónico
        console.log(logID, 'Borrando todas las key');
        await database.deleteMultipleElements('sessionID', {email});
        database.resetSessionIDList();
        console.log(logID, 'Keys borradas');

        //Responder al cliente
        res.status(200).send({ok: true});
        console.log(logID, 'todas las sesiones cerradas');
    });
}
