const database = require("../database");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/note', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/note\033[0m');
        console.log('body',req.body);

        //Vemos si tienemos los datos necesarios
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('BadRequest: no body');
            return;
        }

        //Revisamos si se envían todos los requerimientos
        if(req.body.key === undefined || req.body.noteid === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Comprobar el userID para obtener el correo.
        const key = req.body.key;
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
        const email = keyData.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'emailUndefined'});
            console.log('emailUndefined');
            return;
        }

        //Obtener la nota
        const targetNoteID = req.body.noteid;
        const theNote = await database.getElement('notes',{id: targetNoteID});
        console.log(theNote);
        if(theNote === null)
        {
            res.status(200).send({error: 'noteDontExist'});
            console.log('noteDontExist');
            return;
        }

        //Comprobar si es el dueño de la nota
        if(theNote.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            return;
        }

        //Enviar la nota
        const theText = theNote.text;
        res.status(200).send({note: theText});
    });
}