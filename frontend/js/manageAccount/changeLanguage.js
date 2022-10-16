document.getElementById('toChangeLanguageMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'changeLanguage';
    changeHashMenu('changeLanguage');

    animatedTransition(mainMenu, changeLanguageMenu);
});

document.getElementById('changeLanguageButton_cancel').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;

    actualMenu = 'main';
    changeHashMenu('main');
    animatedTransition(changeLanguageMenu, mainMenu);
});

document.getElementById('changeLanguageButton_es').addEventListener('click', async function()
{
    if(actualMenu !== 'changeLanguage') return;

    actualMenu = 'main';

    await animatedTransition(changeLanguageMenu, mainMenu);

    thingsChanged.lang = 'es';
    hashReplaceValue('lang', 'es');
    changeHashMenu('main');
    languageAtStart();
});

document.getElementById('changeLanguageButton_en').addEventListener('click', async function()
{
    if(actualMenu !== 'changeLanguage') return;

    actualMenu = 'main';

    await animatedTransition(changeLanguageMenu, mainMenu);

    thingsChanged.lang = 'en';
    hashReplaceValue('lang', 'en');
    changeHashMenu('main');
    languageAtStart();
});