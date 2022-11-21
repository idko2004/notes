// falta hacer y eso
if(process.env.NODE_ENV !== 'production') require('dotenv').config();

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

function sendEmail(whoToSend, emailName, emailHtmlContent)
{
    return new Promise(function(resolve, reject)
    {
        if([whoToSend, emailName, emailHtmlContent].includes(undefined))
        {
            console.log('sendEmail: FALTAN ARGUMENTOS');
            reject();
        }
        if(typeof whoToSend !== 'string' && typeof emailName !== 'string' && typeof emailHtmlContent !== 'string')
        {
            console.log('sendEmail, SE ESPERABAN STRINGS');
            reject();
        }

        const mailOptions =
        {
            from: process.env.EMAIL_USER,
            to: whoToSend,
            subject: emailName,
            html: emailHtmlContent
        }
        console.log(mailOptions);
    
        transporter.sendMail(mailOptions, function(error)
        {
            if(error)
            {
                console.log('//Error mandando email', emailName, error);
                reject();
            }
            else
            {
                console.log('//Email mandado', emailName);
                resolve();
            }
        });

    });
}

module.exports =
{
    sendEmail
}