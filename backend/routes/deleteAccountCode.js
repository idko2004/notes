const database = require('../utils/database');
const bodyDecrypter = require('../utils/bodyDecrypter');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const rand = require('generate-key');

module.exports = function(app)
{
    app.post('/deleteAccountCode', jsonParser, async function(req, res)
    {

        const logID = `(${rand.generateKey(3)})`;

        try
        {
            console.log(logID, '------------------------------------------------');
            console.log(logID, '\033[1;34m/deleteAccount\033[0m');
            console.log(logID, 'body', req.body);
            /*
            {
                deviceID,
                {
                    code,
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



            let code = reqDecrypted.code;
            if(code === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest: no code');
                return;
            }

            let key = reqDecrypted.key;
            if(key === undefined)
            {
                res.status(400).send({error: 'badRequest'});
                console.log(logID, 'badRequest: no key');
                return;
            }



            //Comprobar que la clave sea válida
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



            //Comprobar que el código es válido
            code = code.trim().toUpperCase();
            if(code === '' || code.length !== 5)
            {
                res.status(200).send({error: 'invalidCode'});
                console.log(logID, 'invalidCode: its empty or doesnt have 5 characters');
                return;
            }



            //Buscar el código en la base de datos
            const emailCode = await database.getElement('emailCodes', {code});
            console.log(logID, 'emailCode', emailCode);
            if(emailCode === null)
            {
                res.status(200).send({error: 'invalidCode'});
                console.log(logID, 'invalidCode: no existe');
                return;
            }
            if(emailCode === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, buscando código en la base de datos');
                return;
            }



            //Comprobar que la operación sea deleteAccount
            if(emailCode.operation !== 'deleteAccount')
            {
                res.status(200).send({error: 'invalidOperation'});
                console.log(logID, 'invalidOperation');
                return;
            }



            //Obtener el email
            const email = emailCode.email;
            if(email === undefined)
            {
                res.status(200).send({error: 'theresNoEmailWTF'});
                console.log(logID, 'theresNoEmailWTF');
                return;
            }



            //Comprobar que los emails coinciden (Para no borrar la cuenta de otra persona)
            if(email !== keyData.email)
            {
                res.status(200).send({error: 'invalidCode'});
                console.log(logID, 'invalidCode: is valid but not yours');
                return;
            }



            //Borrar el elemento en mailCodes
            console.log(logID, 'Borrando emailCode');
            const deleteEmailCode = await database.deleteElement('emailCodes', {code});
            console.log(logID, 'deleteEmailCode', deleteEmailCode);
            if(deleteEmailCode === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, borrando emailCode');
                return;
            }



            //Borrar los elementos de sessionID
            console.log(logID, 'Borrando SessionID');
            const deleteSessionID = await database.deleteMultipleElements('sessionID', {email});
            console.log(logID, 'deleteSessionID', deleteSessionID);
            if(deleteSessionID === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, borrando sessionID');
                return;
            }



            //Restablecer la lista local de sessionID
            database.resetSessionIDList();



            //Borrar las notas
            console.log(logID, 'Borrando las notas');
            const deleteNotes = await database.deleteMultipleElements('notes', {owner: email});
            console.log(logID, 'deleteNotes', deleteNotes);
            if(deleteNotes === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, borrando notas');
                return;
            }



            //Borrar el elemento del usuario en users
            console.log(logID, 'Borrando usuario');
            const deleteUser = await database.deleteElement('users', {email});
            console.log(logID, 'deleteUser', deleteUser);
            if(deleteUser === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, borrando usuario');
            }



            //Responder al cliente
            res.status(200).send({accountDeleted: true});
            console.log(logID, 'Cuenta eliminada');
        }
        catch(err)
        {
            res.status(500).send({error: 'serverCrashed'});
            console.log(logID, '\033[41m ALGO SALIÓ MAL \033[0m', err);
        }
    });
}
