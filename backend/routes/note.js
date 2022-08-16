const database = require("../database");
const crypto = require('../crypto');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/note', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
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

        //Obtener la nota
        const theNote = await database.getElement('notes',{id: targetNoteID});
        console.log(logID, theNote);
        if(theNote === null)
        {
            res.status(200).send({error: 'noteDoesntExist'});
            console.log(logID, 'noteDoesntExist');
            return;
        }

        //Comprobar si es el dueño de la nota
        if(theNote.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            console.log(logID, 'notTheOwner');
            return;
        }

        //Enviar la nota
        //const theText = theNote.text;
        const resEncrypted = crypto.encrypt(JSON.stringify({note: theNote.text}), keyData.pswrd);
        res.status(200).send({decrypt: resEncrypted});
        console.log(logID, 'nota enviada');
    });
}
