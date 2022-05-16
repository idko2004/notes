const database = require('../database');

module.exports = function(app)
{
    app.get('/iHaveAValidKey', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/iHaveAValidKey\033[0m');
        console.log('header',req.headers);

        if(req.headers.key === undefined)
        {
            res.status.send(200).send({iHaveAValidKey: 'noYouDont'});
            return;
        }

        const key = req.headers.key;
        const keyData = await database.getKeyData(key);

        if(keyData === null)
        {
            res.status(200).send({iHaveAValidKey: 'noYouDont'});
            return;
        }
        res.status(200).send({iHaveAValidKey: 'yesYouHave'});
    });
}