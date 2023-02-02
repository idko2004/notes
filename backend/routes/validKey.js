const database = require('../utils/database');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/validKey', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/validKey\033[0m');
            console.log(logID, 'body',req.body);

            /*
            /validKey
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
                res.status.send(200).send({validKey: false});
                console.log(logID, 'validKey:false, no hay llave');
                return;
            }
    
            const keyData = await database.getKeyData(key);
    
            if(keyData === null)
            {
                res.status(200).send({validKey: false});
                console.log(logID, 'validKey:false, no se pudo encontrar la llave');
                return;
            }
            if(keyData === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, obteniendo keyData');
                return;
            }

            res.status(200).send({validKey: true});
            console.log(logID, 'validKey:true');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
