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
    /////////////////////////////////////////////////////////////////////
    //      _      _      _          _                             _   //
    //  __| | ___| | ___| |_ ___   / \   ___ ___ ___  _   _ _ __ | |_  //
    //  / _` |/ _ \ |/ _ \ __/ _ \ / _ \ / __/ __/ _ \| | | | '_ \| __|//
    // | (_| |  __/ |  __/ ||  __// ___ \ (_| (_| (_) | |_| | | | | |_ //
    //  \__,_|\___|_|\___|\__\___/_/   \_\___\___\___/ \__,_|_| |_|\__|//
    //                                                                 //
    //   ____          _                                               //
    //  / ___|___   __| | ___                                          //
    // | |   / _ \ / _` |/ _ \                                         //
    // | |__| (_) | (_| |  __/                                         //
    //  \____\___/ \__,_|\___|                                         //
    /////////////////////////////////////////////////////////////////////
 
    app.post('/deleteAccountCode', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/deleteAccountCode\033[0m');
        console.log('body', req.body);

        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no body');
            return;
        }

        //Revisar si tenemos todos los datos
        //key
        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no key');
            return;
        }

        //Obtener el email de la key
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log('invalidKey');
            return;
        }
        const email = keyData.email;
        if(email === undefined)
        {
            res.status(500).send({error: 'emailUndefined'});
            console.log('emailUndefined');
            return;
        }

        //Limpiar anteriores operaciones de la base de datos
        await database.deleteMultipleElements('emailCodes', {email});
        await database.deleteMultipleElements('emailCodes', {oldEmail: email});

        //Generar un código
        let code;
        while(true)
        {
            code = rand.generateKey(5).toUpperCase();
            let element = await database.getElement('emailCodes', {code});
            console.log('tiene que dar null eventualmente:', element);
            if(element === null) break;
        }
        console.log('Expected code', code);
        
        //Crear el objeto para guardar en la base de datos
        //Debe contener: código, operación=deleteAccount, email
        const dateCreated = new Date();
        const newElement =
        {
            code,
            operation: 'deleteAccount',
            email,
            date:
            {
                d: dateCreated.getUTCDate(),
                m: dateCreated.getUTCMonth() + 1,
                y: dateCreated.getUTCFullYear()
            }
        }

        //Guardar el objeto en la base de datos
        const dbCreateEmailCode = await database.createElement('emailCodes', newElement);
        console.log('Código añadido a la base de datos', dbCreateEmailCode);

        //Cargar el email
        let mailContent = fs.readFileSync('emailPresets/deleteAccountEmail.html', 'utf-8');
        if([undefined, null, ''].includes(mailContent))
        {
            res.status(500).send({error: 'cantLoadEmail'});
            console.log('deleteAccount: NO SE PUDO CARGAR EL EMAIL');
            return;
        }
        mailContent = mailContent.replace('{EMAIL_HERE}', email);
        mailContent = mailContent.replace('{CODE_HERE}', code);

        //Enviar el email
        const mailOptions =
        {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Borrar cuenta de Notas',
            html: mailContent
        }

        transporter.sendMail(mailOptions, function(error)
        {
            if(error) console.log('//Error mandando el mail en /createAccountEmailCode', error);
            else console.log('//Email mandado /createAccountEmailCode');
        });

        //Responder al cliente
        res.status(200).send({mailSent: true});
    });

    /////////////////////////////////////////////////////////////////////
    //      _      _      _          _                             _   //
    //   __| | ___| | ___| |_ ___   / \   ___ ___ ___  _   _ _ __ | |_ //
    //  / _` |/ _ \ |/ _ \ __/ _ \ / _ \ / __/ __/ _ \| | | | '_ \| __|//
    // | (_| |  __/ |  __/ ||  __// ___ \ (_| (_| (_) | |_| | | | | |_ //
    //  \__,_|\___|_|\___|\__\___/_/   \_\___\___\___/ \__,_|_| |_|\__|//
    /////////////////////////////////////////////////////////////////////

    app.post('/deleteAccount', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/deleteAccount\033[0m');
        console.log('body', req.body);

        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no body');
            return;
        }

        //Revisar si tenemos todos los datos
        //code   key
        const reqEncrypted = req.body.encrypt;
        if(reqEncrypted === undefined)
        {
            res.status(400).send({error: 'notEncrypted'});
            console.log('notEncrypted');
            return;
        }

        let key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no key');
            return;
        }

        //Comprobar que la clave sea válida
        const keyData = await database.getKeyData(key);
        if(keyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log('invalidKey');
            return;
        }

        let reqDecrypted = crypto.decrypt(reqEncrypted, keyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log('failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);

        let code = reqDecrypted.code;
        if(code === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('badRequest: no code');
            return;
        }

        //Comprobar que el código es válido
        code = code.trim().toUpperCase();
        if(code === '' || code.length !== 5)
        {
            res.status(200).send({error: 'invalidCode'});
            console.log('invalidCode: is empty or dont have 5 characters');
            return;
        }

        //Buscar el código en la base de datos
        const emailCode = await database.getElement('emailCodes', {code});
        console.log('emailCode', emailCode);
        if(emailCode === null)
        {
            res.status(200).send({error: 'invalidCode'});
            console.log('invalidCode: no existe');
            return;
        }

        //Comprobar que la operación sea deleteAccount
        if(emailCode.operation !== 'deleteAccount')
        {
            res.status(200).send({error: 'invalidOperation'});
            console.log('invalidOperation');
            return;
        }

        //Obtener el email
        const email = emailCode.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'theresNoEmailWTF'});
            console.log('theresNoEmailWTF');
            return;
        }

        //Comprobar que los emails coinciden (Para no borrar la cuenta de otra persona)
        if(email !== keyData.email)
        {
            res.status(200).send({error: 'invalidCode'});
            console.log('invalidCode: is valid but not yours');
            return;
        }

        //Borrar el elemento en mailCodes
        console.log('Borrando emailCode');
        const deleteEmailCode = await database.deleteElement('emailCodes', {code});
        console.log('deleteEmailCode', deleteEmailCode);

        //Borrar los elementos de sessionID
        console.log('Borrando SessionID');
        const deleteSessionID = await database.deleteMultipleElements('sessionID', {email});
        console.log('deleteSessionID', deleteSessionID);

        //Restablecer la lista local de sessionID
        database.resetSessionIDList();

        //Borrar las notas
        console.log('Borrando las notas');
        const deleteNotes = await database.deleteMultipleElements('notes', {owner: email});
        console.log('deleteNotes', deleteNotes);

        //Borrar el elemento del usuario en users
        console.log('Borrando usuario');
        const deleteUser = await database.deleteElement('users', {email});
        console.log('deleteUser', deleteUser);

        //Responder al cliente
        res.status(200).send({accountDeleted: true});
        console.log('Cuenta eliminada');
    });
}