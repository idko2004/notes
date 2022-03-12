const {MongoClient} = require('mongodb');
const things = require('./things.json');

const mdbClient = new MongoClient(things.dbURL);

let sessionIDList = {};

async function getElement(collection, objQuery)
{
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const element = await theCollection.findOne(objQuery);
    return element;
}

async function createElement(collection, element)
{
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    theCollection.insertOne(element);
}

async function updateElement(collection, objQuery, newElement)
{
    console.log('**Actualizando elementos**', collection);
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const result = await theCollection.findOneAndUpdate(objQuery, {$set: newElement});
    console.log('**Base de datos actualizada**', collection, result.ok);
    return result.ok;
}

async function deleteElement(collection, objQuery)
{
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const result = await theCollection.deleteOne(objQuery);
    return result;
}

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

        cache = element;
    }
    else console.log('Cargado desde caché', cache);

    upDate(cache);

    return cache;
}

//Actualiza la fecha en la que se usó por última vez la clave
//El nombre es un juego de palabras, ríanse.
async function upDate(element)
{
    console.log('//upDate//');
    console.log('//Fecha guardada//',element.date.d, element.date.m, element.date.y);

    const today = new Date();
    const day = today.getUTCDate();
    const month = today.getUTCMonth() + 1;
    const year = today.getUTCFullYear();
    console.log('//Fecha de hoy//', day, month, year);

    if(year > element.date.y)
    {
        console.log('//El año ha cambiado//');

        element.date.y = year;
        element.date.m = month;
        element.date.d = day;

        sessionIDList[element.key] = element;
        updateElement('sessionID', {key: element.key}, element);
    }
    else if(month > element.date.m)
    {
        console.log('//El mes ha cambiado//');

        element.date.m = month;
        element.date.d = day;

        sessionIDList[element.key] = element;
        updateElement('sessionID', {key: element.key}, element);
    }
    else if(day > element.date.d)
    {
        console.log('//El día ha cambiado//');

        element.date.d = day;

        sessionIDList[element.key] = element;
        updateElement('sessionID', {key: element.key}, element);
    }
}

module.exports = {getElement, createElement, updateElement, deleteElement, getKeyData};