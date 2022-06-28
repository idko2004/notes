let theOtherSecretThing;

function encrypt(input, password)
{
    if(CryptoJS === undefined)
    {
        console.error('CryptoJS is undefined');
        return;
    }

    const result = CryptoJS.AES.encrypt(input, password);
    return result;
}

function decrypt(input, password)
{
    if(CryptoJS === undefined)
    {
        console.error('CryptoJS is undefined');
        return;
    }

    try
    {
        const result = CryptoJS.AES.decrypt(input, password).toString(CryptoJS.enc.Utf8);
        return result;
    }
    catch
    {
        console.error('Error al descifrar');
        return;
    }
}