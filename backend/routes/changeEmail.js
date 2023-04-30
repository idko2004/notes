const database = require('../utils/database');
const crypto = require('../utils/crypto');
const emailUtil = require('../utils/email');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/changeEmail', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/changeEmail\033[0m');
            console.log(logID, 'body', req.body);
    
            /* Ver si tenemos los datos necesarios
                {
                    deviceID,
                    encrypt:
                    {
                        key,
                        newEmail
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



            const key = reqDecrypted.key;
            const newEmail = reqDecrypted.newEmail;

            if([key, newEmail].includes(undefined))
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest: no key or newEmail');
                return;
            }



            //Obtenemos el email del usuario
            const keyData = await database.getKeyData(key);
            if(keyData === null)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'invalidKey');
                return;
            }
            if(keyData === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, loading keyData');
                return;
            }

            const email = keyData.email;
            if(email === undefined)
            {
                res.status(200).send({error: 'emailNull'});
                console.log(logID, 'emailNull');
                return;
            }



            // Comprobamos que el nuevo email sea válido
            const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            const emailIsValid = emailRegex.test(newEmail);

            if(!emailIsValid)
            {
                res.status(200).send({error: 'invalidEmail'});
                console.log(logID, 'el email no es válido');
                return;
            }
            else console.log(logID, 'el email es válido');



            // Comprobar que el nuevo correo no esté en uso por otra cuenta
            const emailInDB = await database.getElement('users', {email: newEmail});
            if(emailInDB !== null)
            {
                res.status(200).send({error: 'duplicatedEmail'});
                console.log(logID, 'este correo ya existe');
                return;
            }
            else console.log(logID, 'este correo es único');



            // Generamos dos códigos
            console.log(logID, 'Generando códigos');
            const code1 = await generateUniqueEmailCodes(logID);
            const code2 = await generateUniqueEmailCodes(logID);



            // Creamos el objeto para guardarlo en la base de datos
            const emailCode =
            {
                code: code1,
                code2,
                email,
                newEmail,
                date: new Date()
            }

            let createDbResult = await database.createElement('emailCodes', emailCode);

            if(createDbResult === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError: creando emailCode');
                return;
            }



            // Cargamos el correo electrónico
            let emailHtmlFile;
            try
            {
                emailHtmlFile = await fs.promises.readFile('emailPresets/changeEmail.html', 'utf-8');
            }
            catch(err)
            {
                res.status(200).send({error: 'serverError'});
                console.log(logID, 'no se pudo cargar el archivo', err);
                return;
            }



            // Guardamos dos variantes en variables distintas
            let emailHtml1 = emailHtmlFile;
            let emailHtml2 = emailHtmlFile;



            // Reemplazamos el código en ambos correos
            emailHtml1 = emailHtml1.replace('{CODE_HERE}', code1);
            emailHtml1 = emailHtml1.replace('{NUMBER_HERE}', 1);

            emailHtml2 = emailHtml2.replace('{CODE_HERE}', code2);
            emailHtml2 = emailHtml2.replace('{NUMBER_HERE}', 2);



            // Enviamos el correo electrónico a ambos emails (el actual y el nuevo)
            await Promise.allSettled(
            [
                emailUtil.sendEmail(email, 'Cambiar correo electrónico | Notas', emailHtml1),
                emailUtil.sendEmail(newEmail, 'Cambiar correo electrónico | Notas', emailHtml2)
            ]);



            // Respondemos al cliente
            res.status(200).send({emailSent: true});
            console.log(logID, 'emails enviados');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}

async function generateUniqueEmailCodes(logID)
{
    let emailCode;
    while(true)
    {
        emailCode = rand.generateKey(5);
        emailCode = emailCode.toUpperCase();
        const codeInDB = await database.getElement('emailCodes', {code: emailCode});
        console.log(logID, 'Tiene que dar null eventualmente', codeInDB);
        if(codeInDB === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, buscando si emailCode existe en la base de datos');
            return;
        }

        if(codeInDB === null)
        {
            console.log(logID, 'el código parece único');
            break;
        }
    }
    return emailCode;
}
