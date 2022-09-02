const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');
const crypto = require('../crypto');

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/deleteNote', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/deleteNote\033[0m');
        console.log(logID, 'body',req.body);

        //Comprobamos si tenemos todos los datos necesarios
        //key   noteID
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no body');
            return;
        }

        const reqEncrypted = req.body.encrypt;
        if(reqEncrypted === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no encrypted');
            return;
        }

        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no key');
            return;
        }

        //Verificamos si la clave es válida y obtenemos el correo
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log(logID, 'invalidKey');
            return;
        }
        if(keyData === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo keyData');
            return;
        }

        const email = keyData.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'emailUndefined'});
            console.log(logID, 'emailUndefined');
            return;
        }

        let reqDecrypted = crypto.decrypt(reqEncrypted, keyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log(logID, 'failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log(logID, reqDecrypted);

        const noteID = reqDecrypted.noteid;
        if(noteID === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no noteid');
            return;
        }

        //Buscamos la nota en la base de datos de notas
        const note = await database.getElement('notes', {id: noteID});
        if(note === null)
        {
            res.status(200).send({error: 'noteNull'});
            console.log(logID, 'noteNull');
            return;
        }
        if(note === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, cargando nota');
            return;
        }
        console.log(logID, 'La nota existe');

        //Comprobamos si la nota es suya
        if(note.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            console.log(logID, 'notTheOwner');
            return;
        }
        console.log(logID, 'Es el dueño de la nota');

        //Borramos la nota
        const deleted = await database.deleteElement('notes', {id: noteID});
        console.log(logID, 'Nota borrada', deleted);
        if(deleted === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, borrando nota');
            return;
        }

        //Buscamos la nota en el perfil del usuario y lo borramos
        let userProfile = await database.getElement('users', {email});
        if(userProfile === null)
        {
            res.status(200).send({error: 'cantFindUserProfile'});
            console.log(logID, 'cantFindUserProfile');
            return;
        }
        if(userProfile === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, buscando perfil del usuario');
            return;
        }

        let notesList = userProfile.notesID;
        if(notesList === undefined)
        {
            res.status(200).send({error: 'cantFindNotesID'});
            console.log(logID, 'cantFindNotesID');
            return;
        }

        //Creamos una nueva lista, y ponemos los elementos que sean distintos a la nota que queremos borrar.
        let newNotesList = [];
        for(let i = 0; i < notesList.length; i++)
        {
            if(notesList[i].id !== noteID) newNotesList.push(notesList[i]);
        }

        userProfile.notesID = newNotesList;
        console.log(logID, userProfile);
        const userProfileSaved = await database.updateElement('users', {email}, userProfile);
        console.log(logID, 'Perfil actualizado', userProfileSaved);
        if(userProfileSaved === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, actualizando el perfil del usuario');
            return;
        }

        //Respondemos al cliente
        res.status(200).send({deleted: true});
        console.log(logID, 'nota borrada');
    });
}