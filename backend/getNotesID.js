const database = require('./database');

module.exports = function(app)
{
    app.get('/getNotesID', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/getNotesID');
        console.log('header',req.headers);
    
        //Comprobar el userID para identificar al usuario y obtener sus notesID.
        const key = req.headers.key;
        console.log('getNotesID - llamando a la getKeyData');
        const keyData = await database.getKeyData(key);
        console.log('getNotesID - getKeyData llamado');
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
    
        //Obtener usuario
        const email = keyData.email;
        console.log('getNotesID - llamando a getElement users');
        const userElement = await database.getElement('users', {email});
        console.log('getNotesID - getElement llamado');
    
        //Obtener notesID
        const notesID = userElement.notesID;
        console.log('getNotesID - a punto de devolver la llamada');
        res.status(200).send({notesID});
        console.log('llamada devolvida');
    });
}