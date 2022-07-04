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
    if(body.encrypt !== undefined)
    {
        body.encrypt = JSON.stringify(body.encrypt);
        body.encrypt = encrypt(body.encrypt, password);
    }
    else console.log('Nothing to encrypt');

    console.log(body);

    const response = await axios.post(`${path}${route}`, body);
    console.log(response);

    if(response.data.decrypt !== undefined)
    {
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
    console.log(response.data);
    return response;
}
