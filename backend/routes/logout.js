const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../utils/database');
const bodyDecrypter = require('../utils/bodyDecrypter');

const rand = require('generate-key');

module.exports = function(app)
{
    ///////////////////////////////////
    // _                         _   //
    //| | ___   __ _  ___  _   _| |_ //
    //| |/ _ \ / _` |/ _ \| | | | __|//
    //| | (_) | (_| | (_) | |_| | |_ //
    //|_|\___/ \__, |\___/ \__,_|\__|//
    //         |___/                 //
    ///////////////////////////////////
    app.post('/logout', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/logout\033[0m');
            console.log(logID, 'body',req.body);
            /*
            {
                deviceID,
                encrypt:
                {
                    key
                }
            }
            */

            const body = await bodyDecrypter.getBody(req.body, res, logID);
            if(body === null)
            {
                console.log(logID, 'Algo salió mal obteniendo body');
                return;
            }

            const reqDecrypted = body.encrypt;

            /*
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
            */

            const key = reqDecrypted.key;
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
            if(keyData === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, obteniendo keyData');
                return;
            }
    
            //Borrar la la key
            const keyDeleted = await database.deleteElement('sessionID', {key});
            delete database.sessionIDList[key];
            if(keyDeleted === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, borrando la clave');
                return;
            }
    
            //Responder al cliente
            res.status(200).send({ok: true});
            console.log(logID, 'sesión cerrada');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // _                         _           _ _       _            _                //
    //| | ___   __ _  ___  _   _| |_    __ _| | |   __| | _____   _(_) ___ ___  ___  //
    //| |/ _ \ / _` |/ _ \| | | | __|  / _` | | |  / _` |/ _ \ \ / / |/ __/ _ \/ __| //
    //| | (_) | (_| | (_) | |_| | |_  | (_| | | | | (_| |  __/\ V /| | (_|  __/\__ \ //
    //|_|\___/ \__, |\___/ \__,_|\__|  \__,_|_|_|  \__,_|\___| \_/ |_|\___\___||___/ //
    //         |___/                                                                 //
    ///////////////////////////////////////////////////////////////////////////////////
    app.post('/logoutalldevices', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
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
            if(keyData === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, obteniendo keyData');
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
            const sessionIDDeleted = await database.deleteMultipleElements('sessionID', {email});
            if(sessionIDDeleted === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, borrando sessionID');
                return;
            }
            database.resetSessionIDList();
            console.log(logID, 'Keys borradas');
    
            //Responder al cliente
            res.status(200).send({ok: true});
            console.log(logID, 'todas las sesiones cerradas');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
