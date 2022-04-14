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
        //email   password   username   operation   oldemail(en caso de updateAccount)
        const accountEmail = req.body.email;
        const oldEmail = req.body.oldemail;
        const accountPassword = req.body.password;
        const accountUsername = req.body.username;
        const accountOperation = req.body.operation;

        if(accountEmail === undefined ||
        accountPassword === undefined ||
        accountUsername === undefined ||
        accountOperation === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        if(!['newAccount', 'updateAccount'].includes(accountOperation))
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        if(accountOperation === 'newAccount')
        {
            oldEmail = accountEmail;
        }
        else if(oldEmail === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }
        else //Se supone que es updateAccount
        {
            //Buscar si el usuario ha realizado una petición anteriormente, en caso de hacerlo borrar las peticiones que haya hecho para que no hayan conflictos. Usando oldEmail como filtro de búsqueda.
            console.log('Se van a borrar peticiones realizadas anteriormente');
            await database.deleteMultipleElements('emailCodes', {oldEmail});
            console.log('Peticiones anteriores borradas');
        }

        //Comprobar si los datos son válidos
        const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        const capitalsRegex = new RegExp('[A-Z]+');
        const notCapitalsRegex = new RegExp('[a-z]+');
        const numbersRegex = new RegExp('[0-9]+');

        let validEmail = emailRegex.test(accountEmail);
        let passwordHasCapitals;
        let passwordHasLowercase;
        let passwordHasNumbers;
        let passwordLength;
        if(accountOperation === 'updateAccount' && accountPassword === '')
        {
            //Si se va a actualizar la cuenta pero la contraseña va a seguir igual
            passwordHasCapitals = true;
            passwordHasLowercase = true;
            passwordHasNumbers = true;
            passwordLength = 10;
        }
        else
        {
            passwordHasCapitals = capitalsRegex.test(accountPassword);
            passwordHasLowercase = notCapitalsRegex.test(accountPassword);
            passwordHasNumbers = numbersRegex.test(accountPassword);
            passwordLength = accountPassword.length;
        }
    
        if(!validEmail ||
        !passwordHasCapitals ||
        !passwordHasLowercase ||
        !passwordHasNumbers ||
        accountEmail.lenght > 320 ||
        passwordLength < 8 ||
        passwordLength > 20 ||
        accountUsername > 30)
        {
            res.status(200).send({error: 'invalidFields'});
            return;
        }

        //Buscamos si no existe un mismo usuario con este correo electrónico
        const emailAlredyExist = await database.getElement('users', {email: oldEmail});
        if(accountOperation === 'newAccount' && emailAlredyExist !== null)
        {
            //Si estamos creando una nueva cuenta, no debe existir una cuenta con este email
            res.status(200).send({error: 'duplicatedEmail'});
            return;
        }

        if(accountOperation === 'updateAccount')
        {
            if(emailAlredyExist === null)
            {
                //si estamos actualizando una cuenta, debe existir una cuenta con este email
                res.status(200).send({error: 'accountDontExist'});
                return;
            }

            //Comprobar que el nuevo email no exista
            if(accountEmail !== oldEmail) //Si tiene el mismo email que antes no hay problema
            {
                const newEmailAlredyExist = await database.getElement('users', {email: accountEmail})
                if(newEmailAlredyExist !== null)
                {
                    res.status(200).send({error: 'duplicatedEmail'});
                    return;
                }
            }
        }

        //Buscamos si este mismo usuario no ha hecho una request antes con los mismos datos
        const emailCodeAlredyExist = await database.getElement('emailCodes', {email: accountEmail});
        console.log('emailCodeAlredyExist', emailCodeAlredyExist !== null)
        if(emailCodeAlredyExist !== null)
        {
            if(emailCodeAlredyExist.email === accountEmail && emailCodeAlredyExist.password === accountPassword && emailCodeAlredyExist.username === accountUsername && emailCodeAlredyExist.operation === accountOperation)
            {
                //Si los datos son exactamente iguales y están guardados en la base de datos, significa que la misma petición ya se realizó y por ende, se supone que el correo electrónico ya debería haber sido enviado.
                res.status(200).send({emailSent: true});
                console.log('No se envió un correo nuevo porque ya debería tener uno');
                console.log('Expected code', emailCodeAlredyExist.code);
                return;
            }
        }
        console.log('Se enviará un nuevo correo');

        //Generamos el código y comprobamos que no esté repetido en la base de datos
        let code;
        while(true)
        {
            code = rand.generateKey(5).toUpperCase();
            let element = await database.getElement('emailCodes', {code});
            console.log('tiene que dar null eventualmente:', element);
            if(element === null) break;
        }
        console.log('Expected code', code);

        //Guardamos el código en la base de datos
        const dateCreated = new Date();
        const newElement =
        {
            code,
            operation: accountOperation,
            email: accountEmail,
            oldEmail,
            password: accountPassword,
            username: accountUsername,
            date:
            {
                d: dateCreated.getUTCDate(),
                m: dateCreated.getUTCMonth() + 1,
                y: dateCreated.getUTCFullYear()
            }
        }

        database.createElement('emailCodes', newElement);

        //Cargamos el html y lo modificamos para poner el código en él
        let mailContent;
        let subject; //Nombre del correo
        if(accountOperation === 'newAccount')
        {
            mailContent = fs.readFileSync('emailPresets/signUpMail.html', 'utf-8');
            mailContent = mailContent.replace('{CODE_HERE}', code);
        
            subject = `Notas - Código para tu nueva cuenta: ${code}` //Definimos ya el nombre del correo
        }
        else //updateAccount
        {
            mailContent = fs.readFileSync('emailPresets/updateDataMail.html', 'utf-8');
            mailContent = mailContent.replace('{CODE_HERE}', code);
            mailContent = mailContent.replace('{EMAIL_HERE}', accountEmail);
            mailContent = mailContent.replace('{USERNAME_HERE}', accountUsername);

            let pswrd = '';
            if(accountPassword === '') pswrd = '(Sin modificar)'
            else for(let i = 0; i < accountPassword.length; i++) pswrd += '*';
            
            mailContent = mailContent.replace('{PASSWORD_HERE}', pswrd);

            subject = 'Notas - Modificar datos de tu cuenta' //Definimos ya el nombre del correo
        }

        //Enviamos el correo electrónico
        const mailOptions =
        {
            from: things.emailUser,
            to: oldEmail,
            subject,
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
        res.status(200).send({hadToInsertOtherCode: false});
    });

    app.post('/updateAccountData', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/updateAccountData');
        console.log('body', req.body);

        if(req.body === undefined)
        {
            console.log('badRequest, body = undefined');
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Comprobamos si tenemos todos los datos
        //code
        let code = req.body.code;
        if(code === undefined)
        {
            console.log('badRequest, faltan datos: code');
            res.status(400).send({error: 'badRequest'});
            return;
        }
        code = code.toUpperCase();

        //Buscamos si el código existe en la base de datos de códigos
        const codeDB = await database.getElement('emailCodes',{code});
        if(codeDB === null || !['updateAccount', 'updateAccount2'].includes(codeDB.operation))
        {
            console.log('invalidCode, el código introducido no es válido.');
            res.status(200).send({error: 'invalidCode'});
            return;
        }

        const newUsername = codeDB.username;
        const newPassword = codeDB.password;
        const newEmail = codeDB.email;
        const oldEmail = codeDB.oldEmail;

        if(newUsername === undefined ||
        newPassword === undefined ||
        newEmail === undefined ||
        oldEmail === undefined)
        {
            console.log('invalidData, algunos de los datos han dado undefined');
            console.log('newUsername', newUsername);
            console.log('newPassword', newPassword);
            console.log('newEmail', newEmail);
            console.log('oldEmail', oldEmail);

            res.status(500).send({error: 'invalidData'});
            return;
        }

        //Buscamos al usuario en la base de datos de usuarios con oldEmail como parámetro de búsqueda
        const user = await database.getElement('users', {email: oldEmail});
        if(user === null)
        {
            console.log('invalidData, el usuario no se encuentra en la base de datos');
            res.status(500).send({error: 'invalidData'});
            return;
        }

        if(oldEmail !== newEmail && codeDB.operation === 'updateAccount')
        {
            console.log('El nuevo correo electrónico necesita confirmarse');
            const updateCode = codeDB;

            //Generamos el código y comprobamos que no esté repetido en la base de datos
            let newCode;
            while(true)
            {
                newCode = rand.generateKey(5).toUpperCase();
                let element = await database.getElement('emailCodes', {newCode});
                console.log('tiene que dar null eventualmente:', element);
                if(element === null) break;
            }
            console.log('Expected code:', newCode);

            //Actualizamos el elemento de la base de datos de códigos poniendo el nuevo código para el otro correo.
            updateCode.code = newCode;
            updateCode.operation = 'updateAccount2';
            database.updateElement('emailCodes', {code}, updateCode);

            //Enviamos el correo al nuevo correo electrónico.
            let mailContent = fs.readFileSync('emailPresets/changeEmail.html', 'utf-8');
            mailContent = mailContent.replace('{OLD_EMAIL_HERE}', oldEmail);
            mailContent = mailContent.replace('{CODE_HERE}', newCode);

            const mailOptions =
            {
                from: things.emailUser,
                to: newEmail,
                subject: `El código para actualizar el correo electrónico de notas: ${newCode}`,
                html: mailContent
            }

            transporter.sendMail(mailOptions, function(error)
            {
                if(error) console.log('//Error mandando el mail en /createAccountEmailCode', error);
                else console.log('//Email mandado /createAccountEmailCode');
            });


            res.status(200).send({hadToInsertOtherCode: true, email: newEmail});
            return;
        }

        //Reemplazamos el email, el nombre de usuario y la contraseña
        let newUser = user;
        newUser.email = newEmail;
        newUser.username = newUsername;
        if(newPassword !== '') newUser.password = newPassword;

        //Guardamos en la base de datos de usuarios
        console.log('Guardando usuario');
        await database.updateElement('users', {email: oldEmail}, newUser);

        //Borramos el elemento de la base de datos de códigos
        console.log('Borrando código de email');
        await database.deleteElement('emailCodes', {code});

        //Cambiar la propiedad de todas las notas
        console.log('Actualizando notas');
        await database.updateMultipleElements('notes', {owner: oldEmail}, {owner: newEmail});

        //Cambiar el correo electrónico de todas las llaves
        console.log('Actualizando llaves');
        await database.updateMultipleElements('sessionID', {email: oldEmail}, {email: newEmail});

        console.log(database.sessionIDList);
        database.resetSessionIDList();
        console.log(database.sessionIDList);

        console.log('Usuario supuestamente actualizado');

        //Respondemos al cliente
        res.status(200).send({updated: true});
    });
}