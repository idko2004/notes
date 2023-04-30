const database = require('../utils/database');
const emailUtil = require('../utils/email');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');


module.exports = function(app)
{
    app.post('/newAccount', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/newAccount\033[0m');
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



            // Obtener el email
            const email = reqDecrypted.email;
            if(email === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest, email dont exist');
                return;
            }



            // Comprobar que sea un email válido
            const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            const emailIsValid = emailRegex.test(email);
    
            if(!emailIsValid)
            {
                res.status(200).send({error: 'invalidEmail'});
                console.log(logID, 'el email no es válido');
                return;
            }
            else console.log(logID, 'el email es válido');



            // Comprobar que el email sea único
            const emailInDB = await database.getElement('users', {email});
            if(emailInDB !== null)
            {
                res.status(200).send({error: 'duplicatedEmail'});
                console.log(logID, 'este correo ya existe');
                return;
            }
            else console.log(logID, 'este correo es único');



            // Generar un código y comprobar que sea único
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



            // Crear un objeto que contenga el código, el email y la operación (newAccount)
            const userCode =
            {
                code: emailCode,
                operation: 'newAccount',
                email,
                date: new Date()
            }



            // Guardar el objeto en la base de datos (emailCodes)
            console.log(logID, 'Guardando código en la base de datos');

            const userCodeSaved = await database.createElement('emailCodes', userCode);
            console.log(logID, userCodeSaved);



            // Cargar el email
            let emailFile;
            console.log('cargando archivo html');
            try
            {
                emailFile = await fs.promises.readFile('emailPresets/signUpMail.html', 'utf-8');
            }
            catch(err)
            {
                console.log(logID, 'error al cargar email', err);
                res.status(200).send({error: 'serverError'});
                return;
            }
            console.log('archivo cargado');



            // Agregar el código al email
            emailFile = emailFile.replace('{CODE_HERE}', emailCode);



            // Enviar el email
            console.log('Enviando email');
            await emailUtil.sendEmail(email, 'Notas | Crear cuenta', emailFile);
            console.log('Email enviado');



            // Responder al cliente que la operación ha salido exitosa
            res.status(200).send({emailSent: true});
            console.log(logID, 'cliente respondido');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
