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

module.exports = {getElement, createElement, getKeyData};