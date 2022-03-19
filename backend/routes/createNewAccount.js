const database = require('../database');
const things = require('../things.json');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const mailer = require('nodemailer');

module.exports = function(app)
{
    app.get('/createAccountEmailCode', async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/createAccountEmailCode');
        console.log('headers', req.headers);

        const accountEmail = req.headers.email;
        if(accountEmail === undefined)
        {
            res.status(400).send({error: 'badRequest'});
            return;
        }

        const transporter = mailer.createTransport(
        {
            service: things.service,
            auth:
            {
                user: things.emailUser,
                pass: things.emailPassword
            }
        });

        const mailOptions =
        {
            from: things.emailUser,
            to: accountEmail,
            subject: '¡Correo desde express! :D',
            text: '<style>div{background-color:green;}</style><div>Holaaaaaa!!!</div>'
        }

        transporter.sendMail(mailOptions, function(error)
        {
            if(error) console.log('Error mandando el mail', error);
            else console.log('Email mandado');
        });

        res.status(200).send({code: 'hola'});
    });

    app.post('/createNewAccount', jsonParser, async function(req, res)
    {
        console.log('------------------------------------------------');
        console.log('/createNewAccount');
        console.log('body', req.body);
    
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        //TODO: Verificar si los parámetros son correctos

        if(username === undefined) username = email.split('@')[0];
    
        const element = await database.getElement('users', {email});
    
        if(element === null) //La cuenta no está repetida
        {
            const toInsert = {email, username, password, notesID:{}};
            database.createElement('users', toInsert);
            console.log('Usuario creado', username);
        }
        else //La cuenta está repetida
        {
            res.status(418).send({code: 'emailInvalid'});
            return;
        }
    
        res.status(200).send({code: 'created'});
    });
}