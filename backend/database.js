if(process.env.NODE_ENV !== 'production') require('dotenv').config();

const {MongoClient} = require('mongodb');

const mdbClient = new MongoClient(process.env.DB_URL);

let sessionIDList = {};

async function getElement(collection, objQuery)
{
    console.log('\033[32m**Obteniendo elemento de la base de datos**\033[0m');
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const element = await theCollection.findOne(objQuery);
    console.log('\033[32m**Elemento obtenido**\033[0m');
    return element;
}

async function createElement(collection, element)
{
    console.log('\033[32m**Creando elemento en la base de datos**\033[0m');
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const result = await theCollection.insertOne(element);
    console.log('\033[32m**Elemento creado en la base de datos**\033[0m', result);
    return result;
}

async function updateElement(collection, objQuery, newElement)
{
    console.log('\033[32m**Actualizando elementos en la base de datos**\033[0m', collection);
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const result = await theCollection.findOneAndUpdate(objQuery, {$set: newElement});
    console.log('\033[32m**Base de datos actualizada**\033[0m', collection, result.ok);
    return result.ok;
}

async function updateMultipleElements(collection, objQuery, toReplace)
{
    console.log('\033[32m**Actualizando múltiples elementos en la base de datos**\033[0m');
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const result = await theCollection.updateMany(objQuery, {$set: toReplace});
    console.log('\033[32m**Múltiples elementos actualizados en la base de datos**\033[0m', result.modifiedCount);
    return result.modifiedCount;
}

async function deleteElement(collection, objQuery)
{
    console.log('\033[32m**Borrando elementos de la base de datos**\033[0m');
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const result = await theCollection.deleteOne(objQuery);
    console.log('\033[32m**Elemento borrado en la base de datos**\033[0m', result);
    return result;
}

async function deleteMultipleElements(collection, objQuery)
{
    console.log('\033[32m**Borrando múltiples elementos de la base de datos**\033[0m');
    await mdbClient.connect();
    const database = mdbClient.db('Notes');
    const theCollection = database.collection(collection);
    const result = await theCollection.deleteMany(objQuery);
    console.log('\033[32m**Multiples elementos borrados de la base de datos**\033[0m', result);
    return result;
}

async function getKeyData(key)
{
    console.log('getKeyData', key);
    let cache = sessionIDList[key];
    if(cache === undefined || cache === null)
    {
        console.log('\033[32m**Buscando usuario en la base de datos**\033[0m');
        await mdbClient.connect();
        const database = mdbClient.db('Notes');
        const collection = database.collection('sessionID');
        const element = await collection.findOne({key});
        sessionIDList[key] = element;
        console.log('\033[32mCargado desde la base de datos\033[0m', element);

        cache = element;
    }
    else console.log('\033[32mCargado desde caché\033[0m', cache);

    upDate(cache);

    return cache;
}

function resetSessionIDList()
{
    sessionIDList = {};
}

//Actualiza la fecha en la que se usó por última vez la clave
//El nombre es un juego de palabras, ríanse.
async function upDate(element)
{
    if(element === null) return;
    console.log('\033[1;32m//upDate//\033[0m');
    console.log('\033[1;32m//Fecha guardada//\033[0m',element.date.d, element.date.m, element.date.y);

    const today = new Date();
    const day = today.getUTCDate();
    const month = today.getUTCMonth() + 1;
    const year = today.getUTCFullYear();
    console.log('\033[1;32m//Fecha de hoy//\033[0m', day, month, year);

    if(year > element.date.y)
    {
        console.log('\033[1;32m//El año ha cambiado//\033[0m');

        element.date.y = year;
        element.date.m = month;
        element.date.d = day;

        sessionIDList[element.key] = element;
        updateElement('sessionID', {key: element.key}, element);
    }
    else if(month > element.date.m)
    {
        console.log('\033[1;32m//El mes ha cambiado//\033[0m');

        element.date.m = month;
        element.date.d = day;

        sessionIDList[element.key] = element;
        updateElement('sessionID', {key: element.key}, element);
    }
    else if(day > element.date.d)
    {
        console.log('\033[1;32m//El día ha cambiado//\033[0m');

        element.date.d = day;

        sessionIDList[element.key] = element;
        updateElement('sessionID', {key: element.key}, element);
    }
}

module.exports =
{
    getElement,
    createElement,
    updateElement,
    updateMultipleElements,
    deleteElement,
    deleteMultipleElements,
    getKeyData,
    sessionIDList,
    resetSessionIDList
};