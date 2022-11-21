const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../utils/database');
const crypto = require('../utils/crypto');

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/renameNote', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/renameNote\033[0m');
        console.log(logID, 'body',req.body);

        //Verificamos si tenemos los datos necesarios
        //key   noteID   newname
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

        //Verificamos la key y obtenemos el email
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
        let newName = reqDecrypted.newname;

        if(noteID === undefined || newName === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no noteid or newname');
            return;
        }
        newName = newName.trim();

        //Verificamos si es un nombre válido
        function invalidName()
        {
            res.status(200).send({error: 'invalidName'});
            console.log(logID, 'invalidName');
            return;
        }

            ///No estar vacía
            if(newName === '') return invalidName();
            ///No empezar por _
            if(newName.startsWith('_')) return invalidName();
            //Pasar de 30 caracteres
            if(newName.length > 30) return invalidName();

        //Obtenemos el perfil del usuario
        const user = await database.getElement('users', {email});
        if(user === null)
        {
            res.status(200).send({error: 'invalidUser'});
            console.log(logID, 'invalidUser');
            return;
        }
        if(user === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo usuario');
            return;
        }

        //Verificamos que notesID exista
        if(user.notesID === undefined)
        {
            res.status(200).send({error: 'idUndefined'});
            console.log(logID, 'idUndefined');
            return;
        }

        //Verificamos que no tenga otra nota que se llame igual y obtenemos la posición de la nota que queremos renombrar
        let noteIndex = -1;
        for(let i = 0; i < user.notesID.length; i++)
        {
            if(user.notesID[i].name === newName) return invalidName();
            if(user.notesID[i].id === noteID) noteIndex = i;
        }

        //Verificamos si es el dueño de la nota
        if(noteIndex === -1)
        {
            res.status(200).send({error: 'idUndefined'});
            console.log(logID, 'notTheOwner');
            return;
        }

        //Cambiamos el nombre de la nota
        user.notesID[noteIndex].name = newName;
        const result = await database.updateElement('users', {email}, user);
        if(result === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, cambiando nombre de la nota');
            return;
        }

        //Respondemos al cliente
        res.status(200).send({result});
        console.log(logID, 'nota renombrada');
    });
}
