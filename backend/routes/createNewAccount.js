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
        //email   password   username
        const accountEmail = req.body.email;
        const accountPassword = req.body.password;
        const accountUsername = req.body.username;
        if(accountEmail === undefined || accountPassword === undefined || accountUsername === undefined || accountUpdate === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Comprobar si los datos son válidos
        const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        const capitalsRegex = new RegExp('[A-Z]+');
        const notCapitalsRegex = new RegExp('[a-z]+');
        const numbersRegex = new RegExp('[0-9]+');

        const validEmail = emailRegex.test(accountEmail);
        const passwordHasCapitals = capitalsRegex.test(accountPassword);
        const passwordHasLowercase = notCapitalsRegex.test(accountPassword);
        const passwordHasNumbers = numbersRegex.test(accountPassword);
    
        if(!validEmail || !passwordHasCapitals || !passwordHasLowercase || !passwordHasNumbers || accountEmail.lenght > 320 || accountPassword.lenght < 8 || accountPassword.lenght > 20 || accountUsername > 30)
        {
            res.status(200).send({error: 'invalidFields'});
            return;
        }

        //Buscamos si no existe un mismo usuario con este correo electrónico
        const emailAlredyExist = await database.getElement('users', {email: accountEmail});
        if(emailAlredyExist !== null)
        {
            res.status(200).send({error: 'duplicatedEmail'});
            return;
        }

        //Buscamos si este mismo usuario no ha hecho una request antes con los mismos datos
        const emailCodeAlredyExist = await database.getElement('emailCodes', {email: accountEmail});
        console.log('emailCodeAlredyExist', emailCodeAlredyExist !== null)
        if(emailCodeAlredyExist !== null)
        {
            if(emailCodeAlredyExist.email === accountEmail && emailCodeAlredyExist.password === accountPassword && emailCodeAlredyExist.username === accountUsername && emailCodeAlredyExist.operation === 'newAccount')
            {
                //Si los datos son exactamente iguales y están guardados en la base de datos, significa que la misma petición ya se realizó y por ende, se supone que el correo electrónico ya debería haber sido enviado.
                res.status(200).send({emailSent: true});
                console.log('No se envió un correo nuevo porque ya debería tener uno');
                return;
            }
        }
        console.log('Se enivará un nuevo correo');

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
    
        if(req.body === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Verificamos que tenemos los datos necesarios
        //código mandado por email
        let code = req.body.code;
        if(code === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }
        code = code.toUpperCase();

        //Verificamos si el código enviado al email existe
        const codeDB = await database.getElement('emailCodes', {code});
        if(codeDB === null || codeDB.operation !== 'newAccount')
        {
            res.status(200).send({error: 'invalidCode'});
            return;
        }

        const email = codeDB.email;
        const password = codeDB.password;
        const username = codeDB.username;
        if(email === undefined || password === undefined || username === undefined)
        {
            res.status(500).send({error: 'invalidData'});
            return;
        }

        //Buscamos si no existe un mismo usuario con este correo electrónico
        const emailAlredyExist = await database.getElement('users', {email});
        if(emailAlredyExist !== null)
        {
            res.status(500).send({error: 'duplicatedEmail'});
            return;
        }

        //Creamos un nuevo elemento en la base de datos de usuarios con el nuevo usuario
        const newUser =
        {
            email, username, password, notesID: []
        }
        const saved = await database.createElement('users', newUser);
        console.log('Usuario creado', saved);

        //Borrar el elemento de emailCodes porque ya se ha usado
        database.deleteElement('emailCodes',{code});

        //Respondemos al cliente
        res.status(200).send({result: saved});
    });
}