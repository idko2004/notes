const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');
const crypto = require('../crypto');

module.exports = function(app)
{
    app.post('/deleteNote', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/deleteNote\033[0m');
        console.log('body',req.body);

        //Comprobamos si tenemos todos los datos necesarios
        //key   noteID
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no body');
            return;
        }

        const reqEncrypted = req.body.encrypt;
        if(reqEncrypted === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no encrypted');
            return;
        }

        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no key');
            return;
        }

        //Verificamos si la clave es válida y obtenemos el correo
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

        let reqDecrypted = crypto.decrypt(reqEncrypted, keyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log('failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log(reqDecrypted);

        const noteID = reqDecrypted.noteid;
        if(noteID === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no noteid');
            return;
        }

        //Buscamos la nota en la base de datos de notas
        const note = await database.getElement('notes', {id: noteID});
        if(note === null)
        {
            res.status(200).send({error: 'noteNull'});
            console.log('noteNull');
            return;
        }
        console.log('La nota existe');

        //Comprobamos si la nota es suya
        if(note.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            console.log('notTheOwner');
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
        res.status(200).send({deleted: true});
        console.log('nota borrada');
    });
}