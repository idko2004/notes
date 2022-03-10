const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');

module.exports = function(app)
{
    app.post('/saveNote', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/saveNote');
        console.log('body', req.body);

        //Comprobamos que tenemos todos los datos necesarios
        const key = req.body.key;
        const noteID = req.body.noteID;
        const noteContent = req.body.noteContent;

        if(key === undefined || noteID === undefined || noteContent === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Obtenemos la información del usuario
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
        const email = keyData.email;

        //Obtenemos la nota en la base de datos
        const note = await database.getElement('notes',{id: noteID});

        //Comprobamos si el usuario es dueño de esa nota
        if(note.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            return;
        }

        //Reemplazamos la nota
        note.text = noteContent;

        //Guardamos la nota en la base de datos
        const result = await database.updateElement('notes', {id: noteID}, note);

        //Enviamos la señal de que la nota fue guardada
        res.status(200).send({result});
    });
}