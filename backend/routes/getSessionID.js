const database = require('../database');
const rand = require('generate-key');

module.exports = function(app)
{
    app.get('/getSessionID', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/getSessionID');
        console.log('header',req.headers);
        
        const username = req.headers.username;
        const password = req.headers.password;

        if(username === undefined || password === undefined)
        {
            res.status(400).send({error: 'badRequest'});
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
                return;
            }
        }
        else
        {
            const element2 = await database.getElement('users', {email: username});
            if(element2 !== null)
            {
                if(element.password === password)
                {
                    linkKey(username);
                    return;
                }
                else
                {
                    res.status(200).send({error: 'wrongPassword'});
                    return;
                }
            }
        }
    
        res.status(200).send({error: 'userDontExist'});
    
        async function linkKey(email)
        {
            let key;
            while(true)
            {
                key = rand.generateKey(7);
                if(sessionIDList[key] === undefined)
                {
                    let element = await database.getElement('sessionID', {key});
                    console.log(element);
                    if(element === null) break;
                }
            }
    
            const dateCreated = new Date();
            const keyData =
            {
                key,
                email,
                date:
                {
                    d: dateCreated.getUTCDate(),
                    m: dateCreated.getUTCMonth() + 1,
                    y: dateCreated.getUTCFullYear()
                }
            }
    
            sessionIDList[key] = keyData;
            database.createElement(keyData);
    
            res.status(200).send({key});
        }
    });
}
