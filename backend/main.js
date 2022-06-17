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
require('./routes/getUsername')(app);
require('./routes/getSessionID')(app);
require('./routes/createNewAccount')(app);
require('./routes/deleteAccount')(app);
require('./routes/iHaveAValidKey')(app);
require('./routes/saveNote')(app);
require('./routes/createNewNote')(app);
require('./routes/deleteNote')(app);
require('./routes/renameNote')(app);
require('./routes/logout')(app);
require('./routes/pingpong')(app);


app.listen(PORT, function()
{
    console.log('Servidor inciado en el puerto', PORT);
});

