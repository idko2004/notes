const database = require('../database');
const things = require('../things.json');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');

const mailer = require('nodemailer');

const transporter = mailer.createTransport(
{
    host: 'smtp.zoho.com',
    auth:
    {
        user: things.emailUser,
        pass: things.emailPassword
    }
});

module.exports = function(app)
{
    app.post('/updateUserDataEmail', jsonParser, async function(req, res)
    {
        //Comprobar si tenemos todos los datos
        //email  username  password

        //Comprobar si el email es válido o es el mismo

        //Comprobar si el nombre de usuario es válido o es el mismo

        //Comprobar si la contraseña es válida o es la misma

        //Generar el código y comprobar que no esté repetido

        //Crear el objeto para la base de datos

        //Guardar el objeto en la base de datos

        //Enviar el email

        //Responder al cliente
    });
}