const database = require('../database');
const rand = require('generate-key');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = function(app)
{
    app.post('/getSessionID', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/getSessionID\033[0m');
        console.log('body',req.body);

        if(Object.keys(req.body).length === 0)
        {
            res.status(400).send({error: 'badRequest'});
            console.log('BadRequest: no body');
            return;
        }
        
        const username = req.body.username;
        const password = req.body.password;

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
                if(element2.password === password)
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
                if(database.sessionIDList[key] === undefined)
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
    
            database.sessionIDList[key] = keyData;
            database.createElement('sessionID', keyData);
    
            res.status(200).send({key});
        }
    });
}
