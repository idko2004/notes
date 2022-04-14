module.exports = function(app)
{
    app.get('/ping', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/ping');
        console.log(req.headers);
        res.status(200).send('pong!');
    });

    app.get('/', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/ping');
        console.log(req.headers);
        res.status(200).send('pong!');
    });
}