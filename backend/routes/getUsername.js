const database = require('../database');

module.exports = function(app)
{
    app.get('/getUsername', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/getUsername');
        console.log('header',req.headers);
    
        //Comprobamos si existen los requisitos
        if(req.headers.key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }
    
        //Buscamos si la key es válida
        const key = req.headers.key;
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
        
        //Buscar el email en la base de datos
        const email = keyData.email;
        const element = await database.getElement('users', {email});
    
        //Obtener el nombre de usuario
        const username = element.username;
        res.status(200).send({username});
    });
}
