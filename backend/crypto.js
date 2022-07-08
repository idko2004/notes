const cryptojs = require('crypto-js');

function encrypt(input, password)
{
    if([input, password].includes(undefined))
    {
        console.error('Faltan parámetros para cifrar');
        return;
    }
    const encrypted = cryptojs.AES.encrypt(input, password).toString();
    return encrypted;
}

function decrypt(input, password)
{
    if([input, password].includes(undefined))
    {
        console.error('Faltan parámetros para descrifar');
        return;
    }
    
    try
    {
        const decrypted = cryptojs.AES.decrypt(input, password).toString(cryptojs.enc.Utf8);
        return decrypted;
    }
    catch
    {
        console.log('HUBO UN ERROR AL DESENCRIPTAR');
        return null;
    }
}

module.exports =
{
    encrypt,
    decrypt
};