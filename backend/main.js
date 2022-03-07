const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

require('./note')(app);
require('./getNotesID')(app);
require('./getUsername')(app);
require('./getSessionID')(app);
require('./createNewAccount')(app);
require('./iHaveAValidKey')(app);

app.listen(port, function()
{
    console.log('Servidor inciado en el puerto', port);
});

