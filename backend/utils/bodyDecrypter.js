/*
Este script espera la siguiente estructura en body:
{
    deviceID,
    encrypt:
    {
        something
    }
}

También requiere body, res y logID
*/

const crypto = require('./crypto');
const database = require('./database');

async function getBody(body, res, logID)
{
    if(res === undefined)
    {
        console.log('bodyDecrypter.getBody: RES IS UNDEFINED');
        return null;
    }
    if(logID === undefined)
    {
        console.log('bodyDecrypter.getBody: logID is undefined');
        return null;
    }

    if(Object.keys(body) === 0)
    {
        res.status(400).send({error: 'badRequest'});
        console.log(logID, 'badRequest, no body');
        return null;
    }

    if(body.deviceID === undefined || body.encrypt === undefined)
    {
        res.status(400).send({error: 'badRequest'});
        console.log(logID, 'badRequest: no deviceID or encrypt');
        console.log(logID, 'deviceID = undefined', body.deviceID === undefined);
        console.log(logID, 'encrypt = undefined', body.encrypt === undefined);
        return null;
    }



    const deviceIdElement = await database.getElement('sessionID',
    {
        code: body.deviceID
    });

    if(deviceIdElement === null)
    {
        res.status(200).send({error: 'invalidPasswordCode'});
        console.log(logID, 'invalidPasswordCode');
        return null;
    }

    if(deviceIdElement === 'dbError')
    {
        res.status(200).send({error: 'dbError'});
        console.log(logID, 'dbError, cargando la clave para descifrar los datos');
        return null;
    }



    const pswrd = deviceIdElement.pswrd;
    if(pswrd === undefined)
    {
        res.status(200).send({error: 'pswrdUndefined'});
        console.log(logID, 'pswrdUndefined');
        return null;
    }


    // Descifrar encrypt
    let reqDecrypted = crypto.decrypt(body.encrypt, pswrd);
    console.log(reqDecrypted);
    if(reqDecrypted === '' || reqDecrypted === null || reqDecrypted === undefined)
    {
        res.status(200).send({error: 'failedToObtainData'});
        console.log(logID, 'failToObtainData: cant decrypt');
        return null;
    }

    try
    {
        console.log('raw decrypted:', reqDecrypted);
        reqDecrypted = JSON.parse(reqDecrypted);
        console.log('parsed:', reqDecrypted);
    }
    catch(err)
    {
        res.status(200).send({error: 'failedToObtainData'});
        console.log(logID, 'JSON.parse HA FALLADO', err);
        return null;
    }

    body.encrypt = reqDecrypted;
    console.log(body);

    return body;
}

module.exports =
{
    getBody
}
