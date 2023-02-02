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
        if(result === '')
        {
            console.log('ES POSIBLE QUE EL RESULTADO DE DESCIFRAR SEA INCORRECTO');
        }
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
    console.log('about to encrypt:', route, JSON.stringify(body));
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
    console.log('raw data response', response.data);

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

// Esta función debe usarse para cargar los valores de deviceID y theOtherSecretThing
function loadIdPswrdAndLogin()
{
    if(deviceID !== undefined
    || theOtherSecretThing !== undefined
    || theSecretThingThatNobodyHasToKnow !== undefined)
    {
        console.log('Se ha solicitado cargar deviceID y pswrd, pero ya estaban cargados');
        return true;
    }

    let id = getKey('_id');
    let pswrd = getKey('_pswrd');
    let login = getKey('_login');

    console.log('id saved:', id);
    console.log('pswrd saved', pswrd);
    console.log('login saved', login);

    if([undefined, null, '', 'undefined', 'null'].includes(id)
    || [undefined, null, '', 'undefined', 'null'].includes(pswrd))
    {
        return false;
    }

    if([undefined, null, '', 'undefined', 'null'].includes(login))
    {
        login = undefined;
        console.log('login es undefined');
    }

    deviceID = id;
    theOtherSecretThing = pswrd;
    theSecretThingThatNobodyHasToKnow = login;

    return true;
}
