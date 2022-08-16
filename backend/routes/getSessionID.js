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
        
        const username = decrypted.username;
        const password = decrypted.password;

        if(username === undefined || password === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            console.log(logID, 'badRequest: no username or password');
            return;
        }
    
        const element = await database.getElement('users', {username});
        if(element !== null)
        {
            if(element.password === password)
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
        else
        {
            const element2 = await database.getElement('users', {email: username});
            if(element2 !== null)
            {
                if(element2.password === password)
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
            database.createElement('sessionID', keyData);

            console.log(logID, 'the new password', newPassword);
            const keyEncrypted = crypto.encrypt(JSON.stringify({key: key, pswrd: newPassword}), decryptPassword);

            await database.deleteElement('sessionID', {code: decryptPasswordID});
    
            res.status(200).send({decrypt: keyEncrypted});
            console.log(logID, 'sessionID enviado');
        }
    });
}
