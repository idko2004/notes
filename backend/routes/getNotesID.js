const database = require('../utils/database');
const crypto = require('../utils/crypto');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/getNotesID', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/getNotesID\033[0m');
            console.log(logID, 'body',req.body);

            /*
            /getNotesID
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
            //Esta ruta recibe datos sin encriptar
            //Comprobar el userID para identificar al usuario y obtener sus notesID.
            if(Object.keys(req.body).length === 0)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'BadRequest: no body');
                return;
            }
    
            const key = req.body.key;
            if(key === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest, no key');
                return;
            }
    
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
        
            //Obtener usuario
            const email = keyData.email;
            if(email === undefined)
            {
                res.status(200).send({error: 'emailUndefined'});
                console.log(logID, 'emailUndefined');
                return;
            }
    
            //Obtener contraseña para cifrar los datos
            const pswrd = keyData.pswrd;
            console.log(logID, 'password', pswrd);
            if(pswrd === undefined)
            {
                res.status(200).send({error: 'cantGetPassword'});
                console.log(logID, 'cantGetPassword');
            }
            */
            const key = reqDecrypted.key;
            if(key === undefined)
            {
                res.status(200).send({error: 'badRequest'});
                console.log(logID, 'badRequest: theres no key');
                return;
            }

            const keyElement = await database.getElement('sessionID', {key});
            if(keyElement === null)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'invalidKey');
                return;
            }

            const email = keyElement.email;
            if(email === undefined)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'esta key no contiene un email por algún motivo');
                return;
            }

            const userElement = await database.getElement('users', {email});
            if(userElement === null)
            {
                res.status(200).send({error: 'userNull'});
                console.log(logID, 'userNull');
                return;
            }
            if(userElement === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, obteniendo usuario');
                return;
            }
    
            //Obtener notesID y cifrar
            const notesID = JSON.stringify({notesID: userElement.notesID});
            const notesIdEncrypted = crypto.encrypt(notesID, body.pswrd);
    
            res.status(200).send({decrypt: notesIdEncrypted});
            console.log(logID, 'notesID enviadas');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
