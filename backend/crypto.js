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

const a = encrypt('tapa la patata', 'asdf324');
console.log('cifrado:', a);
const b = decrypt(a, 'asdf324');
console.log('descifrado:', b);

module.exports =
{
    encrypt,
    decrypt
};