const database = require("../utils/database");
const crypto = require('../utils/crypto');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/note', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/note\033[0m');
            console.log(logID, 'body',req.body);
    
            //Vemos si tienemos los datos necesarios
            if(Object.keys(req.body).length === 0)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'BadRequest: no body');
                return;
            }
            const reqEncrypted = req.body.encrypt;
            if(reqEncrypted === undefined)
            {
                res.status(400).send({error: 'notEncrypted'});
                console.log(logID, 'notEncrypted');
                return;
            }
    
            //Revisamos si se envían todos los requerimientos
            const key = req.body.key;
            if(key === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest');
                return;
            }
    
            //Comprobar el userID para obtener el correo.
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
            const targetNoteID = reqDecrypted.noteid;
            if(targetNoteID === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest, no target note id');
                return;
            }
    
            //Obtener al usuario
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
    
            //Comprobar si el noteID es de este usuario
            let isTheOwner = false;
            for(let i = 0; i < user.notesID.length; i++)
            {
                if(user.notesID[i].id === targetNoteID)
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
    
            //Obtener la nota
            const theNote = await database.getElement('notes',{id: targetNoteID});
            console.log(logID, theNote);
            if(theNote === null)
            {
                res.status(200).send({error: 'noteDoesntExist'});
                console.log(logID, 'noteDoesntExist');
                return;
            }
            if(theNote === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, obteniendo nota');
                return;
            }
            if(theNote.note === undefined)
            {
                res.status(200).send({error: 'noteUndefined'});
                console.log(logID, 'noteUndefined');
                return;
            }
    
            //Descifrar la nota
            const noteContent = crypto.decrypt(theNote.note, noteKey);
            if(noteContent === null)
            {
                res.status(200).send({error: 'cantObtainNote'});
                console.log(logID, 'cantObtainNote');
                return;
            }
    
            //Enviar la nota
            //const theText = theNote.text;
            const resEncrypted = crypto.encrypt(JSON.stringify({note: noteContent}), keyData.pswrd);
            res.status(200).send({decrypt: resEncrypted});
            console.log(logID, 'nota enviada');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
