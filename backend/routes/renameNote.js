const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');
const crypto = require('../crypto');

module.exports = function(app)
{
    app.post('/renameNote', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/renameNote\033[0m');
        console.log('body',req.body);

        //Verificamos si tenemos los datos necesarios
        //key   noteID   newname
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

        //Verificamos la key y obtenemos el email
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

        const noteID = reqDecrypted.noteid;
        let newName = reqDecrypted.newname;

        if(noteID === undefined || newName === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no noteid or newname');
            return;
        }
        newName = newName.trim();

        //Verificamos si es un nombre válido
        function invalidName()
        {
            res.status(200).send({error: 'invalidName'});
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
            return;
        }        

        //Verificamos que notesID exista
        if(user.notesID === undefined)
        {
            res.status(200).send({error: 'idUndefined'});
            console.log('idUndefined');
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
            res.status(200).send({error: 'notTheOwner'});
            console.log('notTheOwner');
            return;
        }

        //Cambiamos el nombre de la nota
        user.notesID[noteIndex].name = newName;
        const result = await database.updateElement('users', {email}, user);

        //Respondemos al cliente
        res.status(200).send({result});
        console.log('nota renombrada');
    });
}