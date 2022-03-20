const database = require('../database');
const things = require('../things.json');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');

const mailer = require('nodemailer');

const transporter = mailer.createTransport(
{
    host: 'smtp.zoho.com',
    auth:
    {
        user: things.emailUser,
        pass: things.emailPassword
    }
});

module.exports = function(app)
{
    app.post('/createAccountEmailCode', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/createAccountEmailCode');
        console.log('body', req.body);

        if(req.body === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Verificamos que tenemos los datos necesarios
        //Email   contraseña
        const accountEmail = req.body.email;
        const accountPassword = req.body.password;
        const accountUsername = req.body.username;
        if(accountEmail === undefined || accountPassword === undefined || accountUsername === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Generamos el código y comprobamos que no esté repetido en la base de datos
        let code;
        while(true)
        {
            code = rand.generateKey(5).toUpperCase();
            let element = await database.getElement('emailCodes', {code});
            console.log(element);
            if(element === null) break;
        }

        //Guardamos el código en la base de datos
        const dateCreated = new Date();
        const newElement =
        {
            code,
            operation: 'newAccount',
            email: accountEmail,
            password: accountPassword,
            username: accountUsername,
            date:
            {
                d: dateCreated.getUTCDate(),
                m: dateCreated.getUTCMonth() + 1,
                y: dateCreated.getUTCFullYear()
            }
        }

        await database.createElement('emailCodes', newElement);

        //Cargamos el html y lo modificamos para poner el código en el
        let mailContent = fs.readFileSync('emailPresets/signUpMail.html', 'utf-8');
        mailContent = mailContent.replace('{CODE_HERE}', code);

        //Enviamos el correo electrónico
        const mailOptions =
        {
            from: things.emailUser,
            to: accountEmail,
            subject: `Notas - Código para tu nueva cuenta: ${code}`,
            html: mailContent
        }

        transporter.sendMail(mailOptions, function(error)
        {
            if(error) console.log('//Error mandando el mail en /createAccountEmailCode', error);
            else console.log('//Email mandado /createAccountEmailCode');
        });

        //Respondemos al cliente
        res.status(200).send({emailSent: true});
    });

    app.post('/createNewAccount', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/createNewAccount');
        console.log('body', req.body);
    
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        //TODO: Verificar si los parámetros son correctos

        if(username === undefined) username = email.split('@')[0];
    
        const element = await database.getElement('users', {email});
    
        if(element === null) //La cuenta no está repetida
        {
            const toInsert = {email, username, password, notesID:{}};
            database.createElement('users', toInsert);
            console.log('Usuario creado', username);
        }
        else //La cuenta está repetida
        {
            res.status(418).send({code: 'emailInvalid'});
            return;
        }
    
        res.status(200).send({code: 'created'});
    });
}