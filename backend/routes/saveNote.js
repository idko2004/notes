const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../utils/database');
const crypto = require('../utils/crypto');
const bodyDecrypter = require('../utils/bodyDecrypter');

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/saveNote', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/saveNote\033[0m');
            console.log(logID, 'body', req.body);
            /*
            {
                deviceID,
                encrypt:
                {
                    key,
                    noteID,
                    noteContent
                }
            }
            */

            const body = await bodyDecrypter.getBody(req.body, res, logID);
            if(body === null)
            {
                console.log(logID, 'Algo salió mal obteniendo body');
                return;
            }

            const reqDecrypted = body.encrypt;

            const key = reqDecrypted.key;
            const noteID = reqDecrypted.noteID;
            const noteContent = reqDecrypted.noteContent;
    
            if(noteID === undefined || noteContent === undefined || key === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest: no noteID, noteContent or key');
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



            //Obtenemos datos de la clave
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



            //Obtenemos el email a partir de la clave
            const email = keyData.email;
            if(email === undefined)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'invalidKey: la clave no tiene email por algún motivo');
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



            //Ciframos la nota
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
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
