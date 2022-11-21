const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../utils/database');
const crypto = require('../utils/crypto');

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/saveNote', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/saveNote\033[0m');
        console.log(logID, 'body', req.body);

        //Comprobamos que tenemos todos los datos necesarios
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

        //Obtenemos la información del usuario
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

        //Desciframos los datos
        let reqDecrypted = crypto.decrypt(reqEncrypted, keyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log(logID, 'failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log(logID, reqDecrypted);

        const noteID = reqDecrypted.noteID;
        const noteContent = reqDecrypted.noteContent;

        if(noteID === undefined || noteContent === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no noteID or noteContent');
            return;
        }

        //Obtenemos la nota en la base de datos
        const note = await database.getElement('notes',{id: noteID});
        if(note === null)
        {
            res.status(200).send({error: 'noteDontExist'});
            console.log(logID, 'noteDontExist');
            return;
        }
        if(note === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo nota');
            return;
        }

        //Obtenemos los datos del usuario
        const user = await database.getElement('users', {email});
        if(user === null)
        {
            res.status(200).send({error: 'cantFindUser'});
            console.log(logID, 'cantFindUser');
            return;
        }
        if(user === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo usuario');
            return;
        }
        if(user.notesID === undefined)
        {
            res.status(200).send({error: 'whyNotesIDAreUndefinedWTF'});
            console.log(logID, 'whyNotesIDAreUndefinedWTF');
            return;
        }
        if(user.noteKey === undefined)
        {
            res.status(200).send({error: 'notesKeyUndefined'});
            console.log(logID, 'notesKeyUndefined');
            return;
        }
        const noteKey = user.noteKey;


        //Comprobamos si el usuario es dueño de esa nota
        let isTheOwner = false;
        for(let i = 0; i < user.notesID.length; i++)
        {
            if(user.notesID[i].id === noteID)
            {
                isTheOwner = true;
                break;
            }
        }

        if(!isTheOwner)
        {
            res.status(200).send({error: 'noteDoesntExist'});
            console.log(logID, 'noteDoesntExist, no es el dueño de la nota');
            return;
        }

        //Encriptamos la nota
        note.note = crypto.encrypt(noteContent, noteKey);

        //Guardamos la nota en la base de datos
        const result = await database.updateElement('notes', {id: noteID}, note);
        if(result === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, guardando nota');
            return;
        }

        //Enviamos la señal de que la nota fue guardada
        res.status(200).send({result});
        console.log(logID, 'nota guardada');
    });
}
