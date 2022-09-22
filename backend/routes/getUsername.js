const database = require('../database');
const crypto = require('../crypto');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/getUsername', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/getUsername\033[0m');
        console.log(logID, 'body',req.body);

        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'BadRequest: no body');
            return;
        }
    
        //Comprobamos si existen los requisitos
        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no key');
            return;
        }
    
        //Buscamos si la key es válida
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
        
        //Buscar el email en la base de datos
        const email = keyData.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'emailUndefined'});
            console.log(logID, 'emailUndefined');
            return;
        }

        const pswrd = keyData.pswrd;
        if(pswrd === undefined)
        {
            res.status(200).send({error: 'cantGetPassword'});
            console.log(logID, 'cantGetPassword');
            return;
        }

        const element = await database.getElement('users', {email});
        console.log(element);
        if(element === null)
        {
            res.status(200).send({error: 'userNull'});
            console.log(logID, 'userNull');
            return;
        }
        if(element === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo usuario');
            return;
        }

        //Obtener el nombre de usuario
        const username = element.username;
        const passwordLength = element.passwordLength;

        const encrypted = crypto.encrypt(JSON.stringify({username, email, passwordLength}), pswrd);

        res.status(200).send({decrypt: encrypted});
        console.log(logID, 'nombre de usuario enviado');
    });
}
