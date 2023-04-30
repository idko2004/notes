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
                    email,
                    lang
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



            // Ver si el idioma está disponible
            const lang = reqDecrypted.lang;
            if(!['es', 'en'].includes(lang))
            {
                res.status(200).send({error: 'languageNotSupported'});
                console.log(logID, 'language not supported');
                return;
            }


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
                emailFile = await fs.promises.readFile(`emailPresets/loginEmail-${lang}.html`, 'utf-8');
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



            // Decidir el idioma del título
            let emailTitles =
            {
                es: "Notas | Iniciar sesión",
                en: "Notes | Log in"
            }



            // Enviar el email
            emailUtil.sendEmail(email, emailTitles[lang], emailFile);



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

