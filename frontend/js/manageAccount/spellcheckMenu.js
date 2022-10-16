document.getElementById('toSpellcheckMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'spellcheck';
    changeHashMenu('spellcheck');
    updateSpellcheckText();

    animatedTransition(mainMenu, spellcheckMenu);
});

function updateSpellcheckText()
{
    let text;

    console.log('spellcheckConfig', spellcheckConfig);
    switch(spellcheckConfig)
    {
        case 'true': text = getText('enabled2'); break;
        case 'false': text = getText('disabled2'); break;
        default: text = getText('configuredByBrowserDefaults'); break;
    }

    document.getElementById('spellcheckText').innerText = text;
}

document.getElementById('spellcheckButton_cancel').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    actualMenu = 'main';
    changeHashMenu('main');
    animatedTransition(spellcheckMenu, mainMenu);
});

document.getElementById('spellcheckButton_enable').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    thingsChanged.spellcheck = 'true';
    spellcheckConfig = 'true';
    actualMenu = 'main';
    changeHashMenu('main');

    animatedTransition(spellcheckMenu, mainMenu);
});

document.getElementById('spellcheckButton_disable').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    thingsChanged.spellcheck = 'false';
    spellcheckConfig = 'false';
    actualMenu = 'main';
    changeHashMenu('main');

    animatedTransition(spellcheckMenu, mainMenu);
});

document.getElementById('spellcheckButton_default').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    thingsChanged.spellcheck = 'default';
    spellcheckConfig = 'default';
    actualMenu = 'main';
    changeHashMenu('main');

    animatedTransition(spellcheckMenu, mainMenu);
});