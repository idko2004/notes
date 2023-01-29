
if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config();
    console.log('\033[1;33mEntorno de pruebas\033[0m');
}

if(process.env.ME_ACORDE_DE_PONER_EL_ARCHIVO !== 'SI')
{
    console.log('\033[1;33mMostrando todas las variables de entorno:\033[0m\n');
    console.log(process.env);
    console.log('\n\033[41mLas variables de entorno no se han asignado correctamente.\033[0m \n\n¿No falta el archivo \033[1;33m.env\033[0m?\n\nSe requieren de las siguientes variables de entorno:\n\nPORT\nDB_URL\nEMAIL_USER\nEMAIL_PASSWORD\nME_ACORDE_DE_PONER_EL_ARCHIVO = SI');
    return;
}

console.log('\033[1;33mIniciando servidor\033[0m');



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
require('./routes/getUserEmail')(app);

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
