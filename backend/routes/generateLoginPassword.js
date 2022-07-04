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

        //En caso de que el código ya haya sido generado anteriormente, simplemente volver a enviarlo
        const codeExists = await database.getElement('sessionID', {code});
        console.log(codeExists);
        if(codeExists !== null)
        {
            res.status(200).send({secret: codeExists.pswrd});
            console.log('Contraseña generada anteriormente enviada');
            return;
        }

        //Generar una contraseña
        const password = rand.generateKey(30);

        //Crear el objeto que contienen la contraseña y el código
        const dateCreated = new Date();
        const obj =
        {
            code,
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
        res.status(200).send({secret: password});
        console.log('contraseña', password);
        console.log('Contraseña enviada');
    });
}