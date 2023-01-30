const cryptojs = require('crypto-js');
const bcrypt = require('bcrypt');
const colors = require('colors');

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
        if(decrypted === '') console.log(colors.red('ES POSIBLE QUE EL RESULTADO DE DESCIFRAR SEA INCORRECTO'));
        return decrypted;
    }
    catch
    {
        console.log('HUBO UN ERROR AL DESENCRIPTAR');
        return null;
    }
}

async function hashPassword(plainPassword)
{
    const hash = await bcrypt.hash(plainPassword, 10);
    return hash;
}

async function comparePassword(plainPassword, hashedPassword)
{
    console.log(`await bcrypt.compare('${plainPassword}', '${hashedPassword}'`);
    const areTheSame = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(areTheSame);
    return areTheSame;
}

module.exports =
{
    encrypt,
    decrypt,
    hashPassword,
    comparePassword
};