const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

const database = require('../utils/database');
const crypto = require('../utils/crypto');

module.exports = function(app)
{
    app.post('/createNewNote', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/createNewNote\033[0m');
        console.log(logID, 'body',req.body);

        //Verificamos si se tienen todos los requerimientos
        //key   noteName
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

        //Obtenemos key del usuario
        const KeyData = await database.getKeyData(key);
        console.log(KeyData);
        if(KeyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log(logID, 'invalidKey');
            return;
        }
        if(KeyData === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, loading keyData');
            return;
        }

        const email = KeyData.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'emailNull'});
            console.log(logID, 'emailNull');
            return;
        }

        let reqDecrypted = crypto.decrypt(reqEncrypted, KeyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log(logID, 'failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log(logID, reqDecrypted);

        let noteName = reqDecrypted.notename;
        if(noteName === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no notename');
            return;
        }
        noteName = noteName.trim();

        //Verificamos si la nota tiene un nombre válido
        function invalidName()
        {
            res.status(200).send({error: 'invalidName'});
            console.log(logID, 'invalidName');
            return;
        }
        ///No estar vacía
        if(noteName === '') return invalidName();
        ///No empezar por _
        if(noteName.startsWith('_')) return invalidName();
        //Pasar de 30 caracteres
        if(noteName.length > 30) return invalidName();
        
        //Verificamos si la nota no tiene un nombre repetido para el usuario.
        const userInfo = await database.getElement('users', {email});
        if(userInfo === null)
        {
            res.status(200).send({error: 'userNull'});
            console.log(logID, 'userNull');
            return;
        }
        if(userInfo === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo información del usuario');
            return;
        }

        if(userInfo.notesID === undefined)
        {
            res.status(200).send({error: 'idUndefined'});
            console.log(logID, 'idUndefined');
            return;
        }
        if(userInfo.noteKey === undefined)
        {
            res.status(200).send({error: 'noteKeyUndefined'});
            console.log(logID, 'noteKeyUndefined');
            return;
        }
        const noteKey = userInfo.noteKey;

        for(let i = 0; i < userInfo.notesID.length; i++)
        {
            if(userInfo.notesID[i].name === noteName) return invalidName();
        }

        //Generamos un código para el noteID y verificamos que no está repetido.
        let noteID = '';
        while(true)
        {
            //Generamos un código
            noteID = rand.generateKey(12); 
            console.log(logID, noteID);

            //Buscamos si el código existe en la base de datos.
            const itAlredyExist = await database.getElement('notes', {id: noteID}); 
            console.log(logID, 'eventualmente debe dar null:', itAlredyExist);

            //Si no existe, salimos del bucle ya que el código es válido
            if(itAlredyExist === null) break;
            if(itAlredyExist === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, generando noteID');
                return;
            }
        }
        console.log(logID, 'El código es único');

        //Encriptar texto vacío porque parece que hay que encriptarlo
        let note = crypto.encrypt('', noteKey);

        //Crear el elemento para la base de datos de notas
        const newNote =
        {
            id: noteID,
            note
        }
        const noteCreated = await database.createElement('notes', newNote);
        if(noteCreated === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, creando nota');
            return;
        }

        //Actualizar el elemento de la base de datos de usuarios para incluir el noteID y el nombre de la nueva nota
        userInfo.notesID.push({id: noteID, name: noteName});
        const userUpdated = await database.updateElement('users', {email}, userInfo);
        if(userUpdated === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, actualizando usuario');
            return;
        }

        //Responder al cliente
        //ok    noteID
        const decrypt = crypto.encrypt(JSON.stringify({noteid: noteID}), KeyData.pswrd);
        res.status(200).send({ok: true, decrypt});
        console.log(logID, 'nota creada');
    });
}