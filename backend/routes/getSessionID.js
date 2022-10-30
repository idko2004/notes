const database = require('../database');
const crypto = require('../crypto');
const rand = require('generate-key');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/getSessionID', jsonParser, async function(req, res)
    {
        const logID = `(${rand.generateKey(3)})`;
        console.log(logID, '------------------------------------------------');
        console.log(logID, '\033[1;34m/getSessionID\033[0m');
        console.log(logID, 'body',req.body);

        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'BadRequest: no body');
            return;
        }
        const encrypted = req.body.encrypt;
        if(encrypted === undefined)
        {
            res.status(400).send({error: 'notEncrypted'});
            console.log(logID, 'notEncrypted');
            return;
        }
        const decryptPasswordID = req.body.code;
        if(decryptPasswordID === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no decrypt ID');
            return;
        }

        //Obtener la clave para descifrar los datos
        const decryptPasswordElement = await database.getElement('sessionID', {code: decryptPasswordID});
        if(decryptPasswordElement === null)
        {
            res.status(400).send({error: 'invalidPasswordCode'});
            console.log(logID, 'invalidPasswordCode');
            return;
        }
        if(decryptPasswordElement === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo clave para descifrar');
            return;
        }

        const decryptPassword = decryptPasswordElement.pswrd;
        if(decryptPassword === undefined)
        {
            res.status(400).send({error: 'pswrdUndefined'});
            console.log(logID, 'pswrdUndefined');
            return;
        }

        //Descifrar los datos
        let decrypted = crypto.decrypt(encrypted, decryptPassword);
        if(decrypted === undefined)
        {
            res.status(200).send({error: 'decryptFailed'});
            console.log(logID, 'decryptFailed');
            return;
        }
        decrypted = JSON.parse(decrypted);
        console.log(decrypted);
        
        const username = decrypted.username;
        const password = decrypted.password;
        console.log(password);

        if(username === undefined || password === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no username or password');
            return;
        }
    
        const element = await database.getElement('users', {username});
        if(element === 'dbError')
        {
            res.status(200).send({error: 'dbError'});
            console.log(logID, 'dbError, obteniendo usuario');
        }
        if(element !== null)
        {
            //if(element.password === password)
            const passwordsMatch = await crypto.comparePassword(password, element.password)
            if(passwordsMatch)
            {
                linkKey(element.email);
                return;
            }
            else
            {
                res.status(200).send({error: 'wrongPassword'});
                console.log(logID, 'wrongPassword');
                return;
            }
        }
        else //Comprobar con el nombre de usuario
        {
            const element2 = await database.getElement('users', {email: username});
            if(element2 === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, obteniendo usuario');
                return;
            }
            if(element2 !== null)
            {
                const passwordsMatch2 = await crypto.comparePassword(password, element2.password);
                if(passwordsMatch2)
                {
                    linkKey(username);
                    return;
                }
                else
                {
                    res.status(200).send({error: 'wrongPassword'});
                    console.log(logID, 'wrongPassword');
                    return;
                }
            }
        }
    
        res.status(200).send({error: 'userDontExist'});
        console.log(logID, 'userDontExist');
    
        async function linkKey(email)
        {
            let key;
            while(true)
            {
                key = rand.generateKey(12);
                if(database.sessionIDList[key] === undefined)
                {
                    let element = await database.getElement('sessionID', {key});
                    console.log(logID, 'tiene que dar null eventualmente:', element);
                    if(element === null) break;
                    if(element === 'dbError')
                    {
                        res.status(200).send({error: 'dbError'});
                        console.log(logID, 'dbError, generando key');
                        return;
                    }
                }
            }
    
            const newPassword = rand.generateKey(30);

            const dateCreated = new Date();
            const keyData =
            {
                key,
                pswrd: newPassword,
                email,
                date:
                {
                    d: dateCreated.getUTCDate(),
                    m: dateCreated.getUTCMonth() + 1,
                    y: dateCreated.getUTCFullYear()
                }
            }

            database.sessionIDList[key] = keyData;
            const newSessionID = await database.createElement('sessionID', keyData);
            if(newSessionID === 'dbError')
            {
                res.status(200).send({error: 'dbError'});
                console.log(logID, 'dbError, guardando sessionID');
                return;
            }

            console.log(logID, 'the new password', newPassword);
            const keyEncrypted = crypto.encrypt(JSON.stringify({key: key, pswrd: newPassword}), decryptPassword);

            await database.deleteElement('sessionID', {code: decryptPasswordID});
    
            res.status(200).send({decrypt: keyEncrypted});
            console.log(logID, 'sessionID enviado');
        }
    });
}
