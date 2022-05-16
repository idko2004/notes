module.exports = function(app)
{
    app.get('/ping', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/ping\033[0m');
        console.log(req.headers);
        res.status(200).send('pong!');
    });

    app.get('/', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('\033[1;34m/ping\033[0m');
        console.log(req.headers);
        res.status(200).send('pong!');
    });
}