const database = require('../database');

module.exports = function(app)
{
    app.get('/getUsername', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/getUsername');
        console.log('header',req.headers);
    
        //Comprobamos si existen los requisitos
        const key = req.headers.key;
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

        res.status(200).send({username, email, passwordLength});
    });
}
