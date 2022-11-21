// Esto reemplaza createNewAccount.js

if(process.env.NODE_ENV !== 'production') require('dotenv').config();

const database = require('../utils/database');
const crypto = require('../utils/crypto');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const fs = require('fs');
const rand = require('generate-key');
const generator = require('generate-password');

const mailer = require('nodemailer');

const transporter = mailer.createTransport(
{
    host: 'smtp.zoho.com',
    auth:
    {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = function(app)
{
    app.post('/newAccount', bodyParser, async function(req, res)
    {
        /* Ver que tenemos los datos necesarios
        {
            code (identificador de cifrado)
            encrypt:
            {
                email
            }
        }
        */

        // Obtener la contraseña de descifrado

        // Descifrar encrypt

        // Obtener el email

        // Comprobar que sea un email válido

        // Generar un código

        // Comprobar que el código sea único

        // Crear un objeto que contenga el código, el email y la operación (newAccount)

        // Guardar el objeto en la base de datos (emailCodes)

        // Cargar el email

        // Agregar el código al email

        // Enviar el email

        // Responder al cliente que la operación ha salido exitosa
    });
}