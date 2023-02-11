const database = require('../utils/database');

const rand = require('generate-key');
const generator = require('generate-password');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/generateLoginPassword', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/generateLoginPassword\033[0m');
            console.log(logID, 'body',req.body);
    
            //Vemos si tienemos los datos necesarios
            //code
            if(Object.keys(req.body).length === 0)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'BadRequest: no body');
                return;
            }
    
            const code = req.body.code;
            if(code === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest: no code');
                return;
            }

            //Comprobar que el código recibido sea válido
    
            //Requiriendo código
            if(code === 'requesting')
            {
                console.log(logID, 'Requiriendo un código nuevo');
                let deviceID;
    
                while(true)
                {
                    deviceID = '_' + rand.generateKey(12);
    
                    const codeExists = await database.getElement('sessionID', {code: deviceID});
                    console.log(logID, 'Eventualmente tiene que dar null:', codeExists);
                    if(codeExists === null) break;
                    if(codeExists === 'dbError')
                    {
                        res.status(200).send({error: 'dbError'});
                        console.log(logID, 'dbError, generando código');
                        return;
                    }
                }
    
                //Generar una contraseña
                const password = generator.generate(
                {
                    length: 30,
                    numbers: true,
                    symbols: true,
                    lowercase: true,
                    uppercase: true,
                    exclude: '"=;'
                });


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
                const savedCode = await database.createElement('sessionID', obj);
                if(savedCode === 'dbError')
                {
                    res.status(200).send({error: 'dbError'});
                    console.log(logID, 'dbError, guardando en sessionID');
                    return;
                }
    
                //Responder al cliente con la contraseña
                res.status(200).send({secret: password, id: deviceID});
                console.log(logID, 'contraseña', password, 'id', deviceID);
                console.log(logID, 'Contraseña enviada');
            }
            //Respondiendo si el código sigue siendo válido
            else
            {
                console.log(logID, 'Preguntando si un código sigue siendo válido');
                //El código debe empezar con _ y luego debe contener números
                if(!code.startsWith('_'))
                {
                    res.status(400).send({error: 'invalidCode'});
                    console.log(logID, 'invalidCode');
                    return;
                }

                //En caso de que se esté comprobando, el código debe existir en la base de datos
                const codeExists = await database.getElement('sessionID', {code});
                console.log(logID, codeExists);

                if(codeExists === 'dbError')
                {
                    res.status(200).send({error: 'dbError'});
                    console.log(logID, 'dbError, comprobando que el código siga existiendo');
                    return;
                }
                if(codeExists !== null)
                {
                    res.status(200).send({stillValid: true});
                    console.log(logID, 'La contraseña sigue siendo válida');
                }
                else
                {
                    res.status(200).send({stillValid: false});
                    console.log(logID, 'El deviceID ya no existe en la base de datos');
                }
            }
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
