const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');
const crypto = require('../crypto');

module.exports = function(app)
{
    app.post('/saveNote', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/saveNote\033[0m');
        console.log('body', req.body);

        //Comprobamos que tenemos todos los datos necesarios
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

        //Obtenemos la información del usuario
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

        //Desciframos los datos
        let reqDecrypted = crypto.decrypt(reqEncrypted, keyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log('failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log(reqDecrypted);

        const noteID = reqDecrypted.noteID;
        const noteContent = reqDecrypted.noteContent;

        if(noteID === undefined || noteContent === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no noteID or noteContent');
            return;
        }

        //Obtenemos la nota en la base de datos
        const note = await database.getElement('notes',{id: noteID});
        if(note === null)
        {
            res.status(200).send({error: 'noteDontExist'});
            console.log('noteDontExist');
            return;
        }

        //Comprobamos si el usuario es dueño de esa nota
        if(note.owner !== email)
        {
            res.status(200).send({error: 'notTheOwner'});
            console.log('notTheOwner');
            return;
        }

        //Reemplazamos la nota
        note.text = noteContent;

        //Guardamos la nota en la base de datos
        const result = await database.updateElement('notes', {id: noteID}, note);

        //Enviamos la señal de que la nota fue guardada
        res.status(200).send({result});
        console.log('nota guardada');
    });
}