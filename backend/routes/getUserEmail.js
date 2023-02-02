const database = require('../utils/database');
const crypto = require('../utils/crypto');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/getUserEmail', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/getUserEmail\033[0m');
            console.log(logID, 'body', req.body);
    
            /* Ver si tenemos los datos necesarios
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

            const key = reqDecrypted.key;
            if(key === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest: no hay key');
                return;
            }


            const keyData = await database.getKeyData(key);
            if(keyData === null)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'invalidKey: no se pudo encontrar la key');
                return;
            }
            if(keyData === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError: buscando key en la base de datos');
                return;
            }

            const email = keyData.email;
            if(email === undefined)
            {
                res.status(200).send({error: 'serverError'});
                console.log(logID, 'la clave no tiene asignada un email por algún motivo');
                return;
            }

            const resEncrypted = crypto.encrypt(JSON.stringify({email}), body.pswrd);

            res.status(200).send({decrypt: resEncrypted});
    
            /*
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
    
            //Obtenemos key del usuario
            const KeyData = await database.getKeyData(key);
            console.log(KeyData);
            if(KeyData === null)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'invalidKey');
                return;
            }
            if(KeyData === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, loading keyData');
                return;
            }
    
            const email = KeyData.email;
            if(email === undefined)
            {
                res.status(200).send({error: 'emailNull'});
                console.log(logID, 'emailNull');
                return;
            }
    
            const encryptPswrd = KeyData.pswrd;
            if([undefined, '', null].includes(encryptPswrd))
            {
                res.status(200).send({error: 'serverError'});
                console.log(logID, 'la key no tenía asociada una contraseña de cifrado');
                return;
            }
    
            const responseEncrypted = crypto.encrypt(JSON.stringify({email}), encryptPswrd);
    
            res.status(200).send({decrypt: responseEncrypted});
            */
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
