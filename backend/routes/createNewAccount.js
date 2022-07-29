if(process.env.NODE_ENV !== 'production') require('dotenv').config();

const database = require('../database');
const crypto = require('../crypto');

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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = function(app)
{
    //////////////////////////////////////////////////////////////////////
    //                     _          _                             _   //
    //  ___ _ __ ___  __ _| |_ ___   / \   ___ ___ ___  _   _ _ __ | |_ //
    /// __| '__/ _ \/ _` | __/ _ \ / _ \ / __/ __/ _ \| | | | '_ \| __| //
    //| (__| | |  __/ (_| | ||  __// ___ \ (_| (_| (_) | |_| | | | | |_ //
    //\___|_|  \___|\__,_|\__\___/_/   \_\___\___\___/ \__,_|_| |_|\__| //
    //                                                                  //
    //_____                 _ _  ____          _                        //
    //| ____|_ __ ___   __ _(_) |/ ___|___   __| | ___                  //
    //|  _| | '_ ` _ \ / _` | | | |   / _ \ / _` |/ _ \                 //
    //| |___| | | | | | (_| | | | |__| (_) | (_| |  __/                 //
    //|_____|_| |_| |_|\__,_|_|_|\____\___/ \__,_|\___|                 //
    //////////////////////////////////////////////////////////////////////

    app.post('/createAccountEmailCode', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/createAccountEmailCode\033[0m');
        console.log(logID, 'body', req.body);

        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no body');
            return;
        }

        //Verificamos que tenemos los datos necesarios
        //email   password   username   operation   oldemail(en caso de updateAccount)   key/id

        //Verificamos que método de cifrado tenemos, si sessionID o deviceID
        const key = req.body.key;
        const deviceID = req.body.id;
        const reqEncrypted = req.body.encrypt;
        let pswrd;

        if(reqEncrypted === undefined)
        {
            res.status(400).send({error: 'notEncrypted'});
            console.log(logID, 'badRequest: notEncrypted');
            return;
        }

        if(key !== undefined) //El método de cifrado es key, por lo que están actualizando datos
        {
            const keyData = await database.getKeyData(key);
            if(keyData === null)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'invalidKey');
                return;
            }
            pswrd = keyData.pswrd; //Obtenemos la contraseña para descifrar
            if(pswrd === undefined)
            {
                res.status(200).send({error: 'invalidKey'});
                console.log(logID, 'invalidKey: the key somehow doesnt have a password');
                return;
            }
        }
        else if(deviceID !== undefined) //El método de cifrado es deviceID, por lo que están creando una nueva cuenta
        {
            return;
        }
        else
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no key or deviceID');
            return;
        }

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

        const accountEmail = reqDecrypted.email;
        let oldEmail = reqDecrypted.oldemail;
        const accountPassword = reqDecrypted.password;
        const accountUsername = reqDecrypted.username;
        const accountOperation = reqDecrypted.operation;

        if(accountEmail === undefined ||
        accountUsername === undefined ||
        accountOperation === undefined||
        (accountPassword === undefined && accountOperation !== 'updateAccount'))
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no email, password, username or operation');
            console.log(logID, 'email', accountEmail !== undefined);
            console.log(logID, 'password', accountPassword !== undefined);
            console.log(logID, 'username', accountUsername !== undefined);
            console.log(logID, 'operation', accountOperation);
            return;
        }

        if(!['newAccount', 'updateAccount'].includes(accountOperation))
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: operation must be newAccount or updateAccount');
            console.log(logID, 'operation is', operation);
            return;
        }

        if(accountOperation === 'newAccount')
        {
            oldEmail = accountEmail;
        }
        else if(oldEmail === undefined) //updateAccount pero no hay oldEmail
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: oldEmail is needed');
            return;
        }
        else //Se supone que es updateAccount
        {
            //Buscar si el usuario ha realizado una petición anteriormente, en caso de hacerlo borrar las peticiones que haya hecho para que no hayan conflictos. Usando oldEmail como filtro de búsqueda.
            console.log(logID, 'Se van a borrar peticiones realizadas anteriormente');
            await database.deleteMultipleElements('emailCodes', {oldEmail});
            await database.deleteMultipleElements('emailCodes', {email: oldEmail});
            console.log(logID, 'Peticiones anteriores borradas');
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
        if(accountOperation === 'updateAccount' && ['', undefined, 'undefined', null, 'null'].includes(accountPassword))
        {
            console.log(logID, 'Asumimos que la contraseña no se cambia debido a que es undefined o null y la operación realizada es updateAccount', accountPassword);
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
        accountUsername.lenght > 30)
        {
            res.status(200).send({error: 'invalidFields'});
            console.log(logID, 'invalidFields');
            console.log(logID, 'validEmail', validEmail);
            console.log(logID, 'passwordHasCapitals', passwordHasCapitals);
            console.log(logID, 'passwordHasLowercase', passwordHasLowercase);
            console.log(logID, 'passwordsHasNumbers', passwordHasNumbers);
            console.log(logID, 'accountEmail.length < 320', accountEmail.length < 320);
            console.log(logID, 'passwordLength >= 8', passwordLength >= 8);
            console.log(logID, 'passwordLength <= 20', passwordLength <= 20);
            console.log(logID, 'accountUsername <= 30', accountUsername.length <= 30);
            return;
        }

        //Buscamos si no existe un mismo usuario con este correo electrónico
        const emailAlredyExist = await database.getElement('users', {email: oldEmail});
        if(accountOperation === 'newAccount' && emailAlredyExist !== null)
        {
            //Si estamos creando una nueva cuenta, no debe existir una cuenta con este email
            res.status(200).send({error: 'duplicatedEmail'});
            console.log(logID, 'duplicatedEmail');
            return;
        }

        if(accountOperation === 'updateAccount')
        {
            if(emailAlredyExist === null)
            {
                //si estamos actualizando una cuenta, debe existir una cuenta con este email
                res.status(200).send({error: 'accountDontExist'});
                console.log(logID, 'accountDontExist: operation is updateAccount but there is no account to update');
                return;
            }

            //Comprobar que el nuevo email no exista
            if(accountEmail !== oldEmail) //Si tiene el mismo email que antes no hay problema
            {
                const newEmailAlredyExist = await database.getElement('users', {email: accountEmail})
                if(newEmailAlredyExist !== null)
                {
                    res.status(200).send({error: 'duplicatedEmail'});
                    console.log(logID, 'duplicatedEmail on updateAccount');
                    return;
                }
            }
        }

        //Buscamos si este mismo usuario no ha hecho una request antes con los mismos datos
        const emailCodeAlredyExist = await database.getElement('emailCodes', {email: accountEmail});
        console.log(logID, 'emailCodeAlredyExist', emailCodeAlredyExist !== null)
        if(emailCodeAlredyExist !== null)
        {
            if(emailCodeAlredyExist.email === accountEmail && emailCodeAlredyExist.password === accountPassword && emailCodeAlredyExist.username === accountUsername && emailCodeAlredyExist.operation === accountOperation)
            {
                //Si los datos son exactamente iguales y están guardados en la base de datos, significa que la misma petición ya se realizó y por ende, se supone que el correo electrónico ya debería haber sido enviado.
                res.status(200).send({emailSent: true});
                console.log(logID, 'No se envió un correo nuevo porque ya debería tener uno');
                console.log(logID, 'Expected code', emailCodeAlredyExist.code);
                return;
            }
        }
        console.log(logID, 'Se enviará un nuevo correo');

        //Generamos el código y comprobamos que no esté repetido en la base de datos
        let code;
        while(true)
        {
            code = rand.generateKey(5).toUpperCase();
            let element = await database.getElement('emailCodes', {code});
            console.log(logID, 'tiene que dar null eventualmente:', element);
            if(element === null) break;
        }
        console.log(logID, 'Expected code', code);

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

        console.log(logID, 'nuevo emailCode:', newElement);
        const dbCreateEmailCode = await database.createElement('emailCodes', newElement);
        console.log(logID, 'Código añadido a la base de datos', dbCreateEmailCode);

        //Cargamos el html y lo modificamos para poner el código en él
        let mailContent;
        let subject; //Nombre del correo
        if(accountOperation === 'newAccount')
        {
            mailContent = fs.readFileSync('emailPresets/signUpMail.html', 'utf-8');
            mailContent = mailContent.replace('{CODE_HERE}', code);
        
            subject = `Notas - Código para tu nueva cuenta: ${code}`; //Definimos ya el nombre del correo
        }
        else //updateAccount
        {
            mailContent = fs.readFileSync('emailPresets/updateDataMail.html', 'utf-8');
            mailContent = mailContent.replace('{CODE_HERE}', code);
            mailContent = mailContent.replace('{EMAIL_HERE}', accountEmail);
            mailContent = mailContent.replace('{USERNAME_HERE}', accountUsername);

            let pswrd = '';
            if(['', undefined, 'undefined', null, 'null'].includes(accountPassword)) pswrd = '(La misma de antes, sin cambios)';
            else for(let i = 0; i < accountPassword.length; i++) pswrd += '*';
            
            mailContent = mailContent.replace('{PASSWORD_HERE}', pswrd);

            subject = 'Notas - Modificar datos de tu cuenta' //Definimos ya el nombre del correo
        }

        //Enviamos el correo electrónico
        const mailOptions =
        {
            from: process.env.EMAIL_USER,
            to: oldEmail,
            subject,
            html: mailContent
        }

        transporter.sendMail(mailOptions, function(error)
        {
            if(error) console.log(logID, '//Error mandando el mail en /createAccountEmailCode', error);
            else console.log(logID, '//Email mandado /createAccountEmailCode');
        });

        //Respondemos al cliente
        res.status(200).send({emailSent: true});
        console.log(logID, 'Email solicitado exitosamente');
    });

    //////////////////////////////////////////////////////////////////////
    //                     _       _   _                                //
    //  ___ _ __ ___  __ _| |_ ___| \ | | _____      __                 //
    /// __| '__/ _ \/ _` | __/ _ \  \| |/ _ \ \ /\ / /                  //
    //| (__| | |  __/ (_| | ||  __/ |\  |  __/\ V  V /                  //
    //\___|_|  \___|\__,_|\__\___|_| \_|\___| \_/\_/                    //
    //                                                                  //
    //    _                             _                               //
    //   / \   ___ ___ ___  _   _ _ __ | |_                             //
    //  / _ \ / __/ __/ _ \| | | | '_ \| __|                            //
    // / ___ \ (_| (_| (_) | |_| | | | | |_                             //
    ///_/   \_\___\___\___/ \__,_|_| |_|\__|                            //
    //////////////////////////////////////////////////////////////////////


    app.post('/createNewAccount', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/createNewAccount\033[0m');
        console.log(logID, 'body', req.body);
    
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no body');
            return;
        }

        //Verificamos que tenemos los datos necesarios
        //código mandado por email
        let code = req.body.code;
        if(code === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no code');
            return;
        }
        code = code.toUpperCase();

        //Verificamos si el código enviado al email existe
        const codeDB = await database.getElement('emailCodes', {code});
        console.log(logID, codeDB);
        if(codeDB === null || codeDB.operation !== 'newAccount')
        {
            res.status(200).send({error: 'invalidCode'});
            console.log(logID, 'invalidcode');
            return;
        }

        const email = codeDB.email;
        const password = codeDB.password;
        const username = codeDB.username;
        if(email === undefined || password === undefined || username === undefined)
        {
            res.status(500).send({error: 'invalidData'});
            console.log(logID, 'invalidData');
            return;
        }

        //Buscamos si no existe un mismo usuario con este correo electrónico
        const emailAlredyExist = await database.getElement('users', {email});
        if(emailAlredyExist !== null)
        {
            res.status(500).send({error: 'duplicatedEmail'});
            console.log(logID, 'duplicatedEmail');
            return;
        }

        //Creamos un nuevo elemento en la base de datos de usuarios con el nuevo usuario
        const newUser =
        {
            email, username, password, notesID: []
        }
        const saved = await database.createElement('users', newUser);
        console.log(logID, 'Usuario creado', saved);

        //Borrar el elemento de emailCodes porque ya se ha usado
        database.deleteElement('emailCodes',{code});

        //Respondemos al cliente
        res.status(200).send({hadToInsertOtherCode: false});
    });

    //////////////////////////////////////////////////////////////////////////
    //                 _       _          _                             _   //
    // _   _ _ __   __| | __ _| |_ ___   / \   ___ ___ ___  _   _ _ __ | |_ //
    //| | | | '_ \ / _` |/ _` | __/ _ \ / _ \ / __/ __/ _ \| | | | '_ \| __|//
    //| |_| | |_) | (_| | (_| | ||  __// ___ \ (_| (_| (_) | |_| | | | | |_ //
    //\__,_| .__/ \__,_|\__,_|\__\___/_/   \_\___\___\___/ \__,_|_| |_|\__| //
    //      |_|                                                             //
    //____        _                                                         //
    //|  _ \  __ _| |_ __ _                                                 //
    //| | | |/ _` | __/ _` |                                                //
    //| |_| | (_| | || (_| |                                                //
    //|____/ \__,_|\__\__,_|                                                //
    //////////////////////////////////////////////////////////////////////////

    app.post('/updateAccountData', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/updateAccountData\033[0m');
        console.log(logID, 'body', req.body);

        if(Object.keys(req.body).length === 0)
        {
            console.log(logID, 'badRequest, body = undefined');
            res.status(400).send({error: 'badRequest'});
            return;
        }

        //Comprobamos si tenemos todos los datos
        //code key
        const reqEncrypted = req.body.encrypt;
        const key = req.body.key;
        if(key === undefined || reqEncrypted === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no key or encrypted data');
            return;
        }

        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log(logID, 'invalidKey');
            return;
        }
        if(keyData.email === undefined)
        {
            res.status(200).send({error: 'theresNoEmailWTF'});
            console.log(logID, 'theresNoEmailWTF: no email in keyData');
            return;
        }

        let reqDecrypted = crypto.decrypt(reqEncrypted, keyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log(logID, 'failToObtainData');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);


        let code = reqDecrypted.code;
        if(code === undefined)
        {
            console.log(logID, 'badRequest, faltan datos: code or key');
            res.status(400).send({error: 'badRequest'});
            return;
        }
        code = code.toUpperCase();

        //Buscamos si el código existe en la base de datos de códigos
        const codeDB = await database.getElement('emailCodes',{code});
        console.log(logID, codeDB);
        if(codeDB === null || !['updateAccount', 'updateAccount2'].includes(codeDB.operation))
        {
            console.log(logID, 'invalidCode, el código introducido no es válido.');
            res.status(200).send({error: 'invalidCode'});
            return;
        }

        const newUsername = codeDB.username;
        const newPassword = codeDB.password;
        const newEmail = codeDB.email;
        const oldEmail = codeDB.oldEmail;

        if(newUsername === undefined ||
        newEmail === undefined ||
        oldEmail === undefined)
        {
            console.log(logID, 'invalidData, algunos de los datos han dado undefined');
            console.log(logID, 'newUsername', newUsername);
            console.log(logID, 'newPassword', newPassword);
            console.log(logID, 'newEmail', newEmail);
            console.log(logID, 'oldEmail', oldEmail);

            res.status(500).send({error: 'invalidData'});
            return;
        }

        //Comprobamos que el email asociado a la key sea el mismo que el del código
        if(oldEmail !== keyData.email || newEmail !== keyData.email)
        {
            res.status(200).send({error: 'invalidCode'});
            console.log(logID, 'invalidCode: emails dont match');
            return;
        }

        //Comprobamos si hay nuevo correo electrónico, en caso de haberlo debe confirmarse
        if(oldEmail !== newEmail && codeDB.operation === 'updateAccount')
        {
            console.log(logID, 'El nuevo correo electrónico necesita confirmarse');
            const updateCode = codeDB;

            //Generamos el código y comprobamos que no esté repetido en la base de datos
            let newCode;
            while(true)
            {
                newCode = rand.generateKey(5).toUpperCase();
                let element = await database.getElement('emailCodes', {newCode});
                console.log(logID, 'tiene que dar null eventualmente:', element);
                if(element === null) break;
            }
            console.log(logID, 'Expected code:', newCode);

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
                from: process.env.EMAIL_USER,
                to: newEmail,
                subject: `El código para actualizar el correo electrónico de notas: ${newCode}`,
                html: mailContent
            }

            transporter.sendMail(mailOptions, function(error)
            {
                if(error) console.log(logID, '//Error mandando el mail en /createAccountEmailCode', error);
                else console.log(logID, '//Email mandado /createAccountEmailCode');
            });


            res.status(200).send({hadToInsertOtherCode: true, email: newEmail});
            console.log(logID, 'Necesita ingresar otro código, email solicitado exitosamente');
            return;
        }

        //Buscamos al usuario en la base de datos de usuarios con oldEmail como parámetro de búsqueda
        const user = await database.getElement('users', {email: oldEmail});
        if(user === null)
        {
            console.log(logID, 'invalidData, el usuario no se encuentra en la base de datos');
            res.status(500).send({error: 'invalidData'});
            return;
        }

        //Reemplazamos el email, el nombre de usuario y la contraseña
        let newUser = user;
        newUser.email = newEmail;
        newUser.username = newUsername;
        if(!['', undefined, 'undefined', null, 'null'].includes(newPassword)) newUser.password = newPassword;

        console.log(logID, 'El usuario queda así:', newUser);

        //Guardamos en la base de datos de usuarios
        console.log(logID, 'Guardando usuario');
        await database.updateElement('users', {email: oldEmail}, newUser);

        //Borramos el elemento de la base de datos de códigos
        console.log(logID, 'Borrando código de email');
        await database.deleteElement('emailCodes', {code});

        //Cambiar la propiedad de todas las notas
        console.log(logID, 'Actualizando notas');
        await database.updateMultipleElements('notes', {owner: oldEmail}, {owner: newEmail});

        //Cambiar el correo electrónico de todas las llaves
        console.log(logID, 'Actualizando llaves');
        await database.updateMultipleElements('sessionID', {email: oldEmail}, {email: newEmail});

        console.log(logID, database.sessionIDList);
        database.resetSessionIDList();
        console.log(logID, database.sessionIDList);

        console.log(logID, 'Usuario supuestamente actualizado');

        //Respondemos al cliente
        res.status(200).send({updated: true});
    });
}