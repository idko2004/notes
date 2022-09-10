let theOtherSecretThing;

function encrypt(input, password)
{
    if(CryptoJS === undefined)
    {
        console.error('CryptoJS is undefined');
        return;
    }

    const result = CryptoJS.AES.encrypt(input, password).toString();
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

async function encryptHttpCall(route, body, password)
{
    if(typeof body !== 'object')
    {
        console.error('not an object');
        return;
    }
    //console.log('password', password);
    console.log(`calling to ${route}`);
    if(body.encrypt !== undefined)
    {
        if(password === undefined)
        {
            console.error('there is no password to encrypt');
            return;
        }
        body.encrypt = JSON.stringify(body.encrypt);
        body.encrypt = encrypt(body.encrypt, password);
    }
    else console.log('Nothing to encrypt');

    console.log('body', body);

    const response = await axios.post(`${path}${route}`, body);

    if(response.data.decrypt !== undefined)
    {
        if(password === undefined)
        {
            console.error('there is no password to decrypt');
            return;
        }

        try
        {
            response.data.decrypt = JSON.parse(decrypt(response.data.decrypt, password));
        }
        catch
        {
            console.error('ERROR AL DESCIFRAR LA RESPUESTA');
            return;
        }
    }
    else console.log('Nothing to decrypt');

    console.log('response', response.data);
    return response;
}
