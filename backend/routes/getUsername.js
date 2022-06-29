const database = require('../database');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/getUsername', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/getUsername\033[0m');
        console.log('body',req.body);

        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('BadRequest: no body');
            return;
        }
    
        //Comprobamos si existen los requisitos
        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }
    
        //Buscamos si la key es válida
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
        
        //Buscar el email en la base de datos
        const email = keyData.email;
        if(keyData.email === undefined)
        {
            res.status(200).send({error: 'emailUndefined'});
            console.log('emailUndefined');
            return;
        }

        const element = await database.getElement('users', {email});
        if(element === null)
        {
            res.status(200).send({error: 'userNull'});
            console.log('userNull');
            return;
        }
    
        //Obtener el nombre de usuario
        const username = element.username;
        const passwordLength = element.password.length;
        const language = element.language;

        res.status(200).send({username, email, passwordLength});
    });
}
