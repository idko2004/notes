const database = require("../database");

module.exports = function(app)
{
    app.get('/note', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/note\033[0m');
        console.log('header',req.headers);

        //Revisamos si se envían todos los requerimientos
        if(req.headers.key === undefined || req.headers.noteid === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Comprobar el userID para obtener el correo.
        const key = req.headers.key;
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
        const targetNoteID = req.headers.noteid;
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