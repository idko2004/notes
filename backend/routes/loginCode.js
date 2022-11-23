// Esto reemplaza a getSessionID
const database = require('../utils/database');
const crypto = require('../utils/crypto');
const emailUtil = require('../utils/email');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');
const generator = require('generate-password');

module.exports = function(app)
{
    app.post('/loginCode', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/loginCode\033[0m');
        console.log(logID, 'body', req.body);

        /* Ver que tenemos los datos necesarios
        {
            deviceID (identificador de cifrado)
            encrypt:
            {
                email,
                code
            }
        }
        */

        if(Object.keys(req.body) === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest, no body');
            return;
        }

        const deviceID = req.body.deviceID;
        const reqEncrypted = req.body.encrypt;

        if([deviceID, reqEncrypted].includes(undefined))
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest, deviceID o encrypt no existen');
            return;
        }



        // Obtener la contraseña de descifrado
        const decryptPasswordElement = await database.getElement('sessionID', {code: deviceID});

        if(decryptPasswordElement === null)
        {
            res.status(400).send({error: 'invalidPasswordCode'});
            console.log(logID, 'invalidPasswordCode');
            return;
        }

        if(decryptPasswordElement === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, cargando la clave para descifrar los datos');
            return;
        }

        pswrd = decryptPasswordElement.pswrd;
        if(pswrd === undefined)
        {
            res.status(400).send({error: 'pswrdUndefined'});
            console.log(logID, 'pswrdUndefined');
            return;
        }



        // Descifrar encrypt
        let reqDecrypted = crypto.decrypt(reqEncrypted, pswrd);
        console.log(reqDecrypted);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log(logID, 'failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log(reqDecrypted);



        // Obtener los datos cifrados
        const code = reqDecrypted.code;
        const email = reqDecrypted.email;
        if([code, email].includes(undefined))
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest, no code or email');
            return;
        }



        // Buscar el código en la base de datos
        const codeInDb = await database.getElement('emailCodes', {code});
        if(codeInDb === null)
        {
            res.status(200).send({error: 'invalidCode'});
            console.log(logID, 'invalidCode');
            return;
        }
        if(codeInDb === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, buscando emailCode');
            return;
        }



        // Comprobar que el email sea el mismo que el asociado al código
        if(codeInDb.email !== email)
        {
            res.status(200).send({error: 'invalidCode'});
            console.log(logID, 'invalidCode, existe pero no es de este correo');
            return;
        }



        // Generar una contraseña para cifrar las llamadas
        const newPassword = generator.generate(
        {
            length: 30,
            numbers: true,
            symbols: true,
            lowercase: true,
            uppercase: true,
            exclude: '"'
        });



        // Generar una clave para sessionID
        const key = rand.generateKey(12);



        // Obtener la fecha UTC
        const dateCreated = new Date();



        // Crear un objeto para guardar en la base de datos
        const sessionID =
        {
            key,
            pswrd: newPassword,
            email,
            date:
            {
                d: dateCreated.getUTCDate(),
                m: dateCreated.getUTCMonth() + 1,
                y: dateCreated.getUTCFullYear()
            }
        }



        // Guardar el objeto en la base de datos
        await database.createElement('sessionID', sessionID);



        // Cifrar las respuestas al cliente
        const answer =
        {
            key,
            pswrd: newPassword
        }
        const resEncrypted = await crypto.encrypt(JSON.stringify(answer), pswrd);



        // Eliminar emailCode de la base de datos
        await database.deleteElement('emailCodes', {code});



        // Responder al usuario con el código para cifrado y su sessionID
        res.status(200).send({decrypt: resEncrypted});
        console.log(logID, 'sesión iniciada');
    });
}
