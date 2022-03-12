const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

const database = require('../database');

module.exports = function(app)
{
    app.post('/createNewNote', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/createNewNote');
        console.log('body',req.body);

        //Verificamos si se tienen todos los requerimientos
        //key   noteName
        if(req.body === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        const key = req.body.key;
        let noteName = req.body.notename;
        if(key === undefined || noteName === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }
        noteName = noteName.trim();

        //Verificamos si la nota tiene un nombre válido
        function invalidName()
        {
            res.status(200).send({error: 'invalidName'});
            return;
        }
        ///No estar vacía
        if(noteName === '') return invalidName();
        ///No empezar por _
        if(noteName.startsWith('_')) return invalidName();
        //Pasar de 30 caracteres
        if(noteName.length > 30) return invalidName();
        
        //Obtenemos key del usuario
        const KeyData = await database.getKeyData(key);
        console.log(KeyData);
        if(KeyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log('invalidKey');
            return;
        }
        const email = KeyData.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'emailNull'});
            console.log('emailNull');
            return;
        }

        //Verificamos si la nota no tiene un nombre repetido para el usuario.
        const userInfo = await database.getElement('users', {email});
        if(userInfo === null)
        {
            res.status(200).send({error: 'userNull'});
            console.log('userNull');
            return;
        }
        if(userInfo.notesID === undefined)
        {
            res.status(200).send({error: 'idUndefined'});
            console.log('idUndefined');
            return;
        }

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
            console.log(noteID);

            //Buscamos si el código existe en la base de datos.
            const itAlredyExist = await database.getElement('notes', {id: noteID}); 
            console.log(itAlredyExist);

            //Si no existe, salimos del bucle ya que el código es válido
            if(itAlredyExist === null) break;
        }
        console.log('El código es único');

        //Crear el elemento para la base de datos de notas
        const newNote =
        {
            id: noteID,
            owner: email,
            text: ''
        }
        await database.createElement('notes', newNote);

        //Actualizar el elemento de la base de datos de usuarios para incluir el noteID y el nombre de la nueva nota
        userInfo.notesID.push({id: noteID, name: noteName});
        await database.updateElement('users', {email}, userInfo);

        //Responder al cliente
        //ok    noteID
        res.status(200).send({ok: true, noteid: noteID});
    });
}