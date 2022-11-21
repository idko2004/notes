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
    app.post('/newAccountCode', bodyParser, async function(req, res)
    {
        /* Ver que tenemos los datos necesarios
        {
            code (identificador de cifrado)
            encrypt:
            {
                emailCode,
                email
            }
        }
        */

        // Obtener la contraseña de descifrado

        // Descrifrar encrypt

        // Obtener el email y el código

        // Buscar el código en la base de datos
        
        // Comprobar que el email pertenezca a ese código

        // Generar una clave para cifrar las notas (preferentemente en una función aparte bien organizadito (debería de crear la carpeta utils))

        // Crear un objeto para el nuevo usuario

        // Guardar el nuevo usuario en la base de datos

        // Responder al usuario que la operación ha salido exitosa
    });
}