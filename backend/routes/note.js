const database = require("../database");
const crypto = require('../crypto');

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
        const reqEncrypted = req.body.encrypt;
        if(reqEncrypted === undefined)
        {
            res.status(400).send({error: 'notEncrypted'});
            console.log('notEncrypted');
            return;
        }

        //Revisamos si se envían todos los requerimientos
        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest');
            return;
        }

        //Comprobar el userID para obtener el correo.
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log('invalidKey');
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
        const targetNoteID = reqDecrypted.noteid;
        if(targetNoteID === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest, no target note id');
            return;
        }

        //Obtener la nota
        const theNote = await database.getElement('notes',{id: targetNoteID});
        console.log(theNote);
        if(theNote === null)
        {
            res.status(200).send({error: 'noteDoesntExist'});
            console.log('noteDoesntExist');
            return;
        }

        //Comprobar si es el dueño de la nota
        if(theNote.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            console.log('notTheOwner');
            return;
        }

        //Enviar la nota
        //const theText = theNote.text;
        const resEncrypted = crypto.encrypt(JSON.stringify({note: theNote.text}), keyData.pswrd);
        res.status(200).send({decrypt: resEncrypted});
        console.log('nota enviada');
    });
}