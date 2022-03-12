const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

require('./routes/note')(app);
require('./routes/getNotesID')(app);
require('./routes/getUsername')(app);
require('./routes/getSessionID')(app);
require('./routes/createNewAccount')(app);
require('./routes/iHaveAValidKey')(app);
require('./routes/saveNote')(app);
require('./routes/createNewNote')(app);
require('./routes/deleteNote')(app);

app.listen(port, function()
{
    console.log('Servidor inciado en el puerto', port);
});

