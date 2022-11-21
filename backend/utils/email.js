// falta hacer y eso
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
    if([whoToSend, emailName, emailHtmlContent].includes(undefined))
    {
        console.log('sendEmail: FALTAN ARGUMENTOS');
        return;
    }
    if(typeof whoToSend !== 'string' && typeof emailName !== 'string' && typeof emailHtmlContent !== 'string')
    {
        console.log('sendEmail, SE ESPERABAN STRINGS');
        return;
    }

    return new Promise(function(resolve, reject)
    {
        const mailOptions =
        {
            from: process.env.EMAIL_USER,
            to: whoToSend,
            subject: emailName,
            html: emailHtmlContent
        }
    
        transporter.sendMail(mailOptions, function()
        {
            if(error)
            {
                console.log('//Error mandando email', emailName, error);
                reject();
            }
            else
            {
                console.log(logID, '//Email mandado', emailName);
                resolve();
            }
        });
    });
}

module.exports =
{
    sendEmail
}