// Esto reemplaza createNewAccount.js

const database = require('../utils/database');
const crypto = require('../utils/crypto');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');
const generator = require('generate-password');


module.exports = function(app)
{
    app.post('/newAccountCode', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/newAccountCode\033[0m');
            console.log(logID, 'body', req.body);
    
            /* Ver que tenemos los datos necesarios
            {
                deviceID (identificador de cifrado)
                encrypt:
                {
                    emailCode,
                    email
                }
            }
            */
            const body = await bodyDecrypter.getBody(req.body, res, logID);
            if(body === null)
            {
                console.log(logID, 'Algo salió mal obteniendo body');
                return;
            }

            const reqDecrypted = body.encrypt;

            /*
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
    
    
    
            // Descrifrar encrypt
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
            */
    
    
            // Obtener el email y el código
            let emailCode = reqDecrypted.emailCode;
            const email = reqDecrypted.email;
            if([emailCode, email].includes(undefined))
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest, email or emailCode dont exist');
                return;
            }
            emailCode = emailCode.toUpperCase();
    
    
    
            // Buscar el código en la base de datos
            const codeInDB = await database.getElement('emailCodes', {code: emailCode});
            if(codeInDB === null)
            {
                res.status(200).send({error: 'invalidCode'});
                console.log(logID, 'el código no existe');
                return;
            }
    
    
    
            // Comprobar que el email pertenezca a ese código
            const dbCode = codeInDB.code;
            const dbEmail = codeInDB.email;
            const dbOperation = codeInDB.operation;
            if([dbCode, dbEmail, dbOperation].includes(undefined))
            {
                res.status(200).send({error: 'strangeCode'});
                console.log(logID, 'el código no contiene todos los elementos, por algún motivo');
                return;
            }
            
            if(dbEmail !== email)
            {
                res.status(200).send({error: 'invalidCode'});
                console.log(logID, 'el código existe, pero no pertenece a este email');
                console.log(dbEmail, email);
                return;
            }
    
    
    
            // Comprobar que el email sea único (no vaya a ser que se intente crear una cuenta dos veces)
            const emailInDB = await database.getElement('users', {email});
            if(emailInDB !== null)
            {
                res.status(200).send({error: 'duplicatedEmail'});
                console.log(logID, 'este correo ya existe');
                return;
            }
            else console.log(logID, 'este correo es único');
    
    
    
    
            // Generar una clave para cifrar las notas
            const noteKey = generator.generate(
            {
                length: 20,
                numbers: true,
                symbols: true,
                lowercase: true,
                uppercase: true,
                exclude: '"'
            });
        
    
    
            // Crear un objeto para el nuevo usuario
            const userID = rand.generateKey(7);
            const newUser =
            {
                userID,
                email,
                noteKey,
                notesID: []
            }
    
    
    
            // Guardar el nuevo usuario en la base de datos
            const saveUser = await database.createElement('users', newUser);
            console.log(logID, saveUser);
    
    
    
            // Responder al usuario que la operación ha salido exitosa
            res.status(200).send({accountCreated: true});
            console.log(logID, 'cuenta creada!');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}