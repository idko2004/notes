// Esto reemplaza a getSessionID
const database = require('../utils/database');
const emailUtil = require('../utils/email');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/login', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/login\033[0m');
            console.log(logID, 'body', req.body);
    
            /* Ver que tenemos los datos necesarios
            {
                deviceID (identificador de cifrado)
                encrypt:
                {
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
*/

            // Obtener el email
            const email = reqDecrypted.email;
            if(email === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest, email dont exist');
                return;
            }
    
    
    
            // Buscar email en la base de datos
            const emailInDb = await database.getElement('users', {email});
    
            if(emailInDb === null)
            {
                res.status(200).send({error: 'userDontExist'});
                console.log(logID, 'userDontExist');
                return;
            }
    
            if(emailInDb === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError: buscando usuario por email');
                return;
            }
    
    
    
            // Generar una clave
            let code;
            while(true)
            {
                code = rand.generateKey(5).toUpperCase();
                const codeInDb = await database.getElement('emailCodes', {code});
                console.log(logID, 'Tiene que dar null eventualmente:', codeInDb);
                if(codeInDb === 'dbError')
                {
                    res.status(200).send({error: 'dbError'});
                    console.log(logID, 'dbError, buscando si emailCode existe en la base de datos');
                    return;
                }
                if(codeInDb === null) break;
            }
    
    
    
            // Crear un objeto para guardarlo en la base de datos
            const emailCode =
            {
                code,
                operation: 'login',
                email,
                date: new Date()
            }
    
    
    
            // Guardar el objeto en la base de datos
            await database.createElement('emailCodes', emailCode);
    
    
    
            // Cargar el email
            let emailFile;
            console.log(logID, 'cargando archivo html');
            try
            {
                emailFile = await fs.promises.readFile('emailPresets/loginEmail.html', 'utf-8');
            }
            catch(err)
            {
                console.log(logID, 'error al cargar email', err);
                res.status(200).send({error: 'serverError'});
                return;
            }
            console.log(logID, 'archivo cargado');
    
    
    
            // Añadir el código en el email
            emailFile = emailFile.replace('{CODE_HERE}', code);
    
    
    
            // Enviar el email
            emailUtil.sendEmail(email, 'Notas | Iniciar sesión', emailFile);
    
    
    
            // Responder al usuario
            res.status(200).send({emailSent: true});
            console.log(logID, 'código para iniciar sesión mandado');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}

