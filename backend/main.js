console.log('\033[1;33mIniciando servidor\033[0m');

if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config();
    console.log('\033[1;33mEntorno de pruebas\033[0m');
}

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());

require('./routes/note')(app);
require('./routes/getNotesID')(app);
//require('./routes/getUsername')(app);
//require('./routes/getSessionID')(app);
require('./routes/login')(app);
require('./routes/loginCode')(app);
//require('./routes/createNewAccount')(app);
require('./routes/newAccountCode.js')(app);
require('./routes/newAccount')(app);
require('./routes/deleteAccount')(app);
require('./routes/iHaveAValidKey')(app);
require('./routes/saveNote')(app);
require('./routes/createNewNote')(app);
require('./routes/deleteNote')(app);
require('./routes/renameNote')(app);
require('./routes/logout')(app);
require('./routes/pingpong')(app);
require('./routes/generateLoginPassword')(app);
require('./routes/changeEmail')(app);
require('./routes/changeEmailCode')(app);

app.get('*', function(req, res)
{
    console.log('------------------------------------------------');
    console.log(req.headers);
    console.log('not here');
    res.status(404).send('not here');
});

app.post('*', function(req, res)
{
    console.log('------------------------------------------------');
    console.log(req.headers);
    console.log('not here');
    res.status(404).send('not here');
});

app.listen(PORT, function()
{
    console.log('Servidor inciado en el puerto', PORT);
});
