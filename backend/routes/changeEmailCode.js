const database = require('../utils/database');
const crypto = require('../utils/crypto');
const emailUtil = require('../utils/email');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/changeEmailCode', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/changeEmailCode\033[0m');
        console.log(logID, 'body', req.body);

        /* Verificar si tenemos los datos necesarios
        {
            key,
            encrypt:
            {
                newEmail,
                codeOld,
                codeNew
            }
        }
        */
        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no body');
            return;
        }
    
        const reqEncrypted = req.body.encrypt;
        if(reqEncrypted === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no encrypted');
            return;
        }
    
        const key = req.body.key;
        if(key === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no key');
            return;
        }



        //Obtenemos key del usuario
        const KeyData = await database.getKeyData(key);
        console.log(KeyData);
        if(KeyData === null)
        {
            res.status(200).send({error: 'invalidKey'});
            console.log(logID, 'invalidKey');
            return;
        }
        if(KeyData === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, loading keyData');
            return;
        }
        
        const email = KeyData.email;
        if(email === undefined)
        {
            res.status(200).send({error: 'emailNull'});
            console.log(logID, 'emailNull');
            return;
        }



        // Desciframos encrypt
        let reqDecrypted = crypto.decrypt(reqEncrypted, KeyData.pswrd);
        if(reqDecrypted === null)
        {
            res.status(200).send({error: 'failToObtainData'});
            console.log(logID, 'failToObtainData: cant decrypt');
            return;
        }
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log(logID, reqDecrypted);

        const newEmail = reqDecrypted.newEmail;
        let codeOld = reqDecrypted.codeOld;
        let codeNew = reqDecrypted.codeNew;

        if([newEmail, codeOld, codeNew] === undefined)
        {
            res.status(200).send({error: 'badRequest'});
            console.log(logID, 'badRequest, faltan datos');
            return;
        }
        codeOld = codeOld.trim().toUpperCase();
        codeNew = codeNew.trim().toUpperCase();



        // Buscar los códigos
        const codeInDb = await database.getElement('emailCodes', {code: codeOld});
        if(codeInDb === null)
        {
            res.status(200).send({error: 'invalidCode'});
            console.log(logID, 'invalidCode: 1');
            return;
        }
        if(codeInDb === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, buscando el código');
            return;
        }



        // Verificar que ambos códigos pertenecen al mismo documento y que el nuevo correo electrónico también coincida con el guardado en el documento.
        if((codeInDb.code !== codeOld)
        || (codeInDb.code2 !== codeNew)
        || (codeInDb.newEmail !== newEmail))
        {
            res.status(200).send({error: 'invalidCode'});
            console.log(logID, 'invalidCode: los datos del documento no coinciden');
            console.log(codeInDb.code, codeOld);
            console.log(codeInDb.code2, codeNew);
            console.log(codeInDb.newEmail, newEmail);
            return;
        }



        // Verificar que no exista ninguna cuenta con el nuevo correo electrónico (no vaya a ser que se creó una en el tiempo que nos tardamos en introducir el código)
        const newEmailInDb = await database.getElement('users', {email: newEmail});
        if(newEmailInDb !== null)
        {
            res.status(200).send({error: 'invalidEmail'});
            console.log(logID, 'invalidEmail: de algún modo este email ya no está disponible');
            return;
        }
        if(newEmailInDb === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, viendo si el nuevo email no dejó de estar disponible mágicamente.');
            return;
        }



        // Cambiar el email en la base de datos del usuario
        console.log(logID, 'Reemplazando email del usuario');
        const userUpdated = await database.updateElement('users', {email: codeInDb.email});
        console.log(userUpdated);

        // Cambiar el email asociado a los sessionID
        console.log(logID, 'Reemplazando email en sessionID');
        const sessionIdUpdated = await database.updateMultipleElements('sessionID', {email: codeInDb.email});
        console.log(sessionIdUpdated);

        // Responder al cliente
        res.status(200).send({emailChanged: true});
        console.log(logID, 'email cambiado');
    });
}
