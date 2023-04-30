const database = require('../utils/database');
const bodyDecrypter = require('../utils/bodyDecrypter');
const emailUtil = require('../utils/email');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

const fs = require('fs');

module.exports = function(app)
{
    app.post('/deleteAccount', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/deleteAccountCode\033[0m');
            console.log(logID, 'body', req.body);
            /*
            {
                deviceID,
                encrypt:
                {
                    key
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



            //Revisar si tenemos todos los datos
            //key
            const key = reqDecrypted.key;
            if(key === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest: no key');
                return;
            }



            //Obtener el email de la key
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
                console.log(logID, 'dbError, obteniendo keyData');
                return;
            }

            const email = keyData.email;
            if(email === undefined)
            {
                res.status(500).send({error: 'emailUndefined'});
                console.log(logID, 'emailUndefined');
                return;
            }



            //Limpiar anteriores operaciones de la base de datos
            const deleteWithEmailQuery = await database.deleteMultipleElements('emailCodes', {email});
            const deleteWithOldEmailQuery = await database.deleteMultipleElements('emailCodes', {oldEmail: email});
            if(deleteWithEmailQuery === 'dbError' || deleteWithOldEmailQuery === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, borrando operaciones anteriores');
                return;
            }



            //Generar un código
            let code;
            while(true)
            {
                code = rand.generateKey(5).toUpperCase();
                let element = await database.getElement('emailCodes', {code});
                console.log(logID, 'tiene que dar null eventualmente:', element);
                if(element === null) break;
                if(element === 'dbError')
                {
                    res.status(200).send({error: 'dbError'});
                    console.log(logID, 'dbError, generando código');
                    return;
                }
            }
            console.log(logID, 'Expected code', code);



            //Crear el objeto para guardar en la base de datos
            const newElement =
            {
                code,
                operation: 'deleteAccount',
                email,
                date: new Date()
            }



            //Guardar el objeto en la base de datos
            const dbCreateEmailCode = await database.createElement('emailCodes', newElement);
            console.log(logID, 'Código añadido a la base de datos', dbCreateEmailCode);
            if(dbCreateEmailCode === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, añadiendo código a la base de datos');
                return;
            }



            //Cargar el email
            let mailContent;
            try
            {
                mailContent = await fs.promises.readFile('emailPresets/deleteAccountEmail.html', 'utf-8');
            }
            catch(err)
            {
                console.log(logID, 'error al cargar email', err);
                res.status(200).send({error: 'serverError'});
                return;
            }

            if([undefined, null, ''].includes(mailContent))
            {
                res.status(500).send({error: 'internalError'});
                console.log(logID, 'deleteAccount: NO SE PUDO CARGAR EL EMAIL');
                return;
            }
            mailContent = mailContent.replace('{EMAIL_HERE}', email);
            mailContent = mailContent.replace('{CODE_HERE}', code);



            //Enviar el email
            emailUtil.sendEmail(email, 'Notas | Borrar cuenta', mailContent);



            //Responder al cliente
            res.status(200).send({mailSent: true});
            console.log(logID, 'email solicitado');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
