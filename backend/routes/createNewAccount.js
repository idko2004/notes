const database = require('../database');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/createNewAccount', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/createNewAccount');
        console.log('body', req.body);
    
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        //TODO: Verificar si los parámetros son correctos

        if(username === undefined) username = email.split('@')[0];
    
        const element = await database.getElement('users', {email});
    
        if(element === null) //La cuenta no está repetida
        {
            const toInsert = {email, username, password, notesID:{}};
            database.createElement('users', toInsert);
            console.log('Usuario creado', username);
        }
        else //La cuenta está repetida
        {
            res.status(418).send({code: 'emailInvalid'});
            return;
        }
    
        res.status(200).send({code: 'created'});
    });
}