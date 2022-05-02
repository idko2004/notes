const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const database = require('../database');


module.exports = function(app)
{
    app.post('/renameNote', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/renameNote');
        console.log('body',req.body);

        //Verificamos si tenemos los datos necesarios
        //key   noteID   newname
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        const key = req.body.key;
        const noteID = req.body.noteid;
        let newName = req.body.newname;

        if(key === undefined || noteID === undefined || newName === undefined)
        {
            res.status(400).send({error: 'badRequest'});
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

        //Verificamos la key y obtenemos el email
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            return;
        }
        const email = keyData.email;

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
            return;
        }

        //Cambiamos el nombre de la nota
        user.notesID[noteIndex].name = newName;
        const result = await database.updateElement('users', {email}, user);

        //Respondemos al cliente
        res.status(200).send({result});
    });
}