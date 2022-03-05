const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const rand = require('generate-key');
const things = require('./things.json');

const app = express();
const port = 3000;

const mdbClient = new MongoClient(things.dbURL);

const jsonParser = bodyParser.json();

let sessionIDList = {};

app.use(cors());

app.get('/note', async function(req, res)
{
    console.log('------------------------------------------------');
    console.log('/note');
    console.log('header',req.headers);

    //Revisamos si se envían todos los requerimientos
    if(req.headers.key === undefined || req.headers.noteid === undefined)
    {
        res.status(400).send({error: 'badRequest'});
        return;
    }

    //Comprobar el userID para obtener el correo.
    const key = req.headers.key;
    const keyData = await getKeyData(key);
    if(keyData === null)
    {
        res.status(200).send({error: 'invalidKey'});
        return;
    }
    const email = keyData.email;

    //Conectamos a la base de datos
    await mdbClient.connect();
    const database = mdbClient.db('Notes');

    //Obtener la nota
    const targetNoteID = req.headers.noteid;
    const notesCollection = database.collection('notes');
    const theNote = await notesCollection.findOne({id: targetNoteID});
    console.log(theNote);

    //Comprobar si es el dueño de la nota
    if(theNote.owner !== email)
    {
        res.status(200).send({error: 'notTheOwner'});
        return;
    }

    //Enviar la nota
    const theText = theNote.text;
    res.status(200).send({note: theText});
});

app.get('/getNotesID', async function(req, res)
{
    console.log('------------------------------------------------');
    console.log('/getNotesID');
    console.log('header',req.headers);

    //Comprobar el userID para identificar al usuario y obtener sus notesID.
    const key = req.headers.key;
    const keyData = await getKeyData(key);
    if(keyData === null)
    {
        res.status(200).send({error: 'invalidKey'});
        return;
    }

    //Obtener usuario
    const email = keyData.email;
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const userCollection = database.collection('users');
    const userElement = await userCollection.findOne({email});

    //Obtener notesID
    const notesID = userElement.notesID;
    res.status(200).send({notesID});
});

app.get('/getUsername', async function(req, res)
{
    console.log('------------------------------------------------');
    console.log('/getUsername');
    console.log('header',req.headers);

    //Comprobamos si existen los requisitos
    if(req.headers.key === undefined)
    {
        res.status(400).send({error: 'badRequest'});
        return;
    }

    //Buscamos si la key es válida
    const key = req.headers.key;
    const keyData = await getKeyData(key);
    if(keyData === null)
    {
        res.status(200).send({error: 'invalidKey'});
        return;
    }

    //Obtener el email
    const email = keyData.email;

    //Buscar el email en la base de datos
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const collection = database.collection('users');
    const element = await collection.findOne({email});

    //Obtener el nombre de usuario
    const username = element.username;
    res.status(200).send({username});
});

app.get('/getSessionID', async function (req, res)
{
    console.log('------------------------------------------------');
    console.log('/getSessionID');
    console.log('header',req.headers);
    
    const username = req.headers.username;
    const password = req.headers.password;

    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const collection = database.collection('users');
    const element = await collection.findOne({username});
    if(element !== null)
    {
        if(element.password === password)
        {
            linkKey(element.email);
            return;
        }
        else
        {
            res.status(200).send({error: 'wrongPassword'});
            return;
        }
    }
    else
    {
        const element2 = await collection.findOne({email: username});
        if(element2 !== null)
        {
            if(element.password === password)
            {
                linkKey(username);
                return;
            }
            else
            {
                res.status(200).send({error: 'wrongPassword'});
                return;
            }
        }
    }

    res.status(200).send({error: 'userDontExist'});

    async function linkKey(email)
    {
        const collection = database.collection('sessionID');
        let key;

        while(true)
        {
            key = rand.generateKey(7);
            if(sessionIDList[key] === undefined)
            {
                let element = await collection.findOne({key});
                console.log(element);
                if(element === null) break;
            }
        }

        const dateCreated = new Date();
        const keyData =
        {
            key,
            email,
            date:
            {
                d: dateCreated.getUTCDate(),
                m: dateCreated.getUTCMonth() + 1,
                y: dateCreated.getUTCFullYear()
            }
        }

        sessionIDList[key] = keyData;
        collection.insertOne(keyData);

        res.status(200).send({key});
    }
});

app.post('/createNewAccount', jsonParser, async function(req, res)
{
    console.log('------------------------------------------------');
    console.log('/createNewAccount');
    console.log(req.body);

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    
    if(username === undefined) username = email.split('@')[0];

    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const collection = database.collection('users');
    const element = await collection.findOne({email: email});

    if(element === null) //La cuenta no está repetida
    {
        const toInsert = {email, username, password, notesID:{}};
        collection.insertOne(toInsert);
        console.log('Usuario creado', username);
    }
    else //La cuenta está repetida
    {
        res.status(418).send({code: 'emailInvalid'});
        return;
    }

    res.status(200).send({code: 'created'});
});

app.listen(port, function()
{
    console.log('Servidor inciado en el puerto', port);
});

async function getKeyData(key)
{
    console.log('getKeyData', key);
    let cache = sessionIDList[key];
    if(cache === undefined)
    {
        console.log('Buscando usuario en la base de datos');
        await mdbClient.connect();
        console.log('Base de datos conectada');
        const database = mdbClient.db('Notes');
        const collection = database.collection('sessionID');
        console.log('Buscando elemento');
        const element = await collection.findOne({key});
        sessionIDList[key] = element;
        console.log('Cargado desde la base de datos', element);
        return element;
    }
    console.log('Cargado desde caché', cache);
    return cache;
}