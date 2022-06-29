const database = require('../database');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/getNotesID', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/getNotesID\033[0m');
        console.log('body',req.body);

        //Comprobar el userID para identificar al usuario y obtener sus notesID.
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('BadRequest: no body');
            return;
        }

        const key = req.body.key;
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