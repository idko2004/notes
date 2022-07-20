const database = require('../database');
const rand = require('generate-key');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/generateLoginPassword', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/generateLoginPassword\033[0m');
        console.log('body',req.body);

        //Vemos si tienemos los datos necesarios
        //code
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('BadRequest: no body');
            return;
        }

        const code = req.body.code;
        if(code === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no code');
            return;
        }

        //Comprobar que el código recibido sea válido

        //Requiriendo código
        if(code === 'requesting')
        {
            console.log('Requiriendo un código nuevo');
            let deviceID;

            while(true)
            {
                deviceID = '_' + Math.random().toString().split('.')[1];

                const codeExists = await database.getElement('sessionID', {code: deviceID});
                console.log('Eventualmente tiene que dar null:', codeExists);
                if(codeExists === null) break;
            }

            //Generar una contraseña
            const password = rand.generateKey(30);

            //Crear el objeto que contienen la contraseña y el código
            const dateCreated = new Date();
            const obj =
            {
                code: deviceID,
                pswrd: password,
                date:
                {
                    d: dateCreated.getUTCDate(),
                    m: dateCreated.getUTCMonth() + 1,
                    y: dateCreated.getUTCFullYear()
                }
            }
            //TODO: que se puedan borrar estos objetos periódicamente

            //Guardar el objeto en la base de datos de sessionID
            await database.createElement('sessionID', obj);

            //Responder al cliente con la contraseña
            res.status(200).send({secret: password, id: deviceID});
            console.log('contraseña', password, 'id', deviceID);
            console.log('Contraseña enviada');
        }
        //Respondiendo si el código sigue siendo válido
        else
        {
            console.log('Preguntando si un código sigue siendo válido');
            //El código debe empezar con _ y luego debe contener números
            if(!code.startsWith('_'))
            {
                res.status(400).send({error: 'invalidCode'});
                console.log('invalidCode');
                return;
            }
            let codeNumbers = code.replace('_', '');
            codeNumbers = parseInt(codeNumbers);
            if(isNaN(codeNumbers))
            {
                res.status(400).send({error: 'invalidCode'});
                console.log('invalidCode');
                return;
            }
        
            //En caso de que se esté comprobando, el código debe existir en la base de datos
            const codeExists = await database.getElement('sessionID', {code});
            console.log(codeExists);
            if(codeExists !== null)
            {
                res.status(200).send({stillValid: true});
                console.log('La contraseña sigue siendo válida');
            }
            else
            {
                res.status(200).send({stillValid: false});
                console.log('El deviceID ya no existe en la base de datos');
            }
        }
    });
}