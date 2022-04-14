let actualLanguage;

const allTexts =
{
    notesAppName:
    {
        es: 'Notas',
        en: 'Notes'
    }
}

function getText(textID)
{
    return allTexts[textID][actualLanguage];
}

function languageAtStart()
{
    let lang = getKey('_lang');
    if(lang === '') lang = navigator.language.split('-')[0];

    actualLanguage = lang;

    console.time('Reemplazando los textos');
    const elementsWithText = document.getElementsByClassName('text');
    for(let i = 0; i < elementsWithText.length; i++)
    {
        let textID = elementsWithText[i].attributes.txt;
        if(textID === undefined) continue;

        let text = getText(textID);
        elementsWithText[i].innerText = text;
    }
    console.timeEnd('Reemplazando los textos');
}