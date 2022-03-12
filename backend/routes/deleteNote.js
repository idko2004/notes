const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');

module.exports = function(app)
{
    app.post('/deleteNote', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/deleteNote');
        console.log('body',req.body);

        //Comprobamos si tenemos todos los datos necesarios
        //key   noteID
        if(req.body === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }
        const key = req.body.key;
        const noteID = req.body.noteid;
        if(key === undefined || noteID === undefined)
        {
            res.status(400).send({error: 'badRequest'});
        }

        //Verificamos si la clave es válida y obtenemos el correo
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
        const email = keyData.email;

        //Buscamos la nota en la base de datos de notas
        const note = await database.getElement('notes', {id: noteID});
        if(note === null)
        {
            res.status(200).send({error: 'noteNull'});
            return;
        }
        console.log('La nota existe');

        //Comprobamos si la nota es suya
        if(note.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            return;
        }
        console.log('Es el dueño de la nota');

        //Borramos la nota
        const deleted = await database.deleteElement('notes', {id: noteID});
        console.log('Nota borrada', deleted);

        //Buscamos la nota en el perfil del usuario y lo borramos
        let userProfile = await database.getElement('users', {email});
        if(userProfile === null)
        {
            res.status(200).send({error: 'cantFindUserProfile'});
            console.log('cantFindUserProfile');
            return;
        }

        let notesList = userProfile.notesID;
        if(notesList === undefined)
        {
            res.status(200).send({error: 'cantFindNotesID'});
            console.log('cantFindNotesID');
            return;
        }

        //Creamos una nueva lista, y ponemos los elementos que sean distintos a la nota que queremos borrar.
        let newNotesList = [];
        for(let i = 0; i < notesList.length; i++)
        {
            if(notesList[i].id !== noteID) newNotesList.push(notesList[i]);
        }

        userProfile.notesID = newNotesList;
        console.log(userProfile);
        const userProfileSaved = await database.updateElement('users', {email}, userProfile);
        console.log('Perfil actualizado', userProfileSaved);

        //Respondemos al cliente
        res.status(200).send({deleted: true, status1: deleted, status2: userProfileSaved});
    });
}