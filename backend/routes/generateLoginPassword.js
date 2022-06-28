const crypto = require('../crypto');
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

        //Comprobar que el código recibido sea único
        const uniqueCode = await database.getElement('sessionID', {code});
        if(uniqueCode !== null)
        {
            res.status(200).send({error: 'repeatedCode'});
            console.log('repeatedCode: code not unique');
            return;
        }

        //Generar una contraseña
        const password = rand.generateKey(40);

        //Crear el objeto que contienen la contraseña y el código
        const obj =
        {
            
        }

        //Guardar el objeto en la base de datos de sessionID

        //Responder al cliente con la contraseña
    });
}