const colors = require('colors');
const db = require('./database');

module.exports =
{
    decideToCleanTmpDocs,
    cleanAllTmpDocs
}

function decideToCleanTmpDocs()
{
    let clean;

    let random = Math.random();
    let threshold = 1/4;

    clean = random < threshold;

    if(clean) cleanAllTmpDocs();
}

async function cleanAllTmpDocs()
{
    await cleanTmpCollection('sessionID');
    await cleanTmpCollection('emailCodes');
}

async function cleanTmpCollection(collection)
{
    let availableCollections =
    [
        'sessionID',
        'emailCodes'
    ]

    if(!availableCollections.includes(collection))
    {
        console.log(colors.red(`--Se llamó a cleanTmpCollection(collection) pero la colección "${collection} no es una colección válida--`));
        return;
    }

    //Obtener la fecha del primer dia del mes pasado
    let limitDate = new Date();
    limitDate.setMonth(limitDate.getMonth() - 1);

    console.log(colors.yellow(`--Se va a limpiar la colección "${collection}" a partir de: ${limitDate.toUTCString()}--`));

    await db.deleteMultipleElements(collection,
    {
        date:
        {
            $lte:
            {
                limitDate
            }
        }
    });

    console.log(colors.yellow(`--La colección "${collection}" fue limpiada--`));
}
