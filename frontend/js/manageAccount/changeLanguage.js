document.getElementById('toChangeLanguageMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'changeLanguage';

    animatedTransition(mainMenu, changeLanguageMenu);
});

document.getElementById('changeLanguageButton_cancel').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;

    actualMenu = 'main';
    animatedTransition(changeLanguageMenu, mainMenu);
});

document.getElementById('changeLanguageButton_es').addEventListener('click', async function()
{
    if(actualMenu !== 'changeLanguage') return;

    actualMenu = 'main';

    await animatedTransition(changeLanguageMenu, mainMenu);

    thingsChanged.lang = 'es';
    hashDelete('lang');
    hashAdd('lang=es');
    languageAtStart();
});

document.getElementById('changeLanguageButton_en').addEventListener('click', async function()
{
    if(actualMenu !== 'changeLanguage') return;

    actualMenu = 'main';

    await animatedTransition(changeLanguageMenu, mainMenu);

    thingsChanged.lang = 'en';
    hashDelete('lang');
    hashAdd('lang=en');
    languageAtStart();
});