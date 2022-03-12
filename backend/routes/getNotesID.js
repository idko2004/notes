const database = require('../database');

module.exports = function(app)
{
    app.get('/getNotesID', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/getNotesID');
        console.log('header',req.headers);
    
        //Comprobar el userID para identificar al usuario y obtener sus notesID.
        const key = req.headers.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
    
        //Obtener usuario
        const email = keyData.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'emailUndefined'});
            console.log('emailUndefined');
            return;
        }

        const userElement = await database.getElement('users', {email});
        if(userElement === null)
        {
            res.status(200).send({error: 'userNull'});
            console.log('userNull');
            return;
        }
    
        //Obtener notesID
        const notesID = userElement.notesID;
        res.status(200).send({notesID});
    });
}