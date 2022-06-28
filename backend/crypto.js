const cryptojs = require('crypto-js');

function encrypt(input, password)
{
    const encrypted = cryptojs.AES.encrypt(input, password).toString();
    return encrypted;
}

function decrypt(input, password)
{

    try
    {
        const decrypted = cryptojs.AES.decrypt(input, password).toString(cryptojs.enc.Utf8);
        return decrypted;    
    }
    catch
    {
        console.log('HUBO UN ERROR AL DESENCRIPTAR');
        return;
    }
}

module.exports =
{
    encrypt,
    decrypt
};