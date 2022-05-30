document.getElementById('changeLanguageButton_cancel').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;

    changeLanguageMenu.hidden = true;
    mainMenu.hidden = false;
    actualMenu = 'main';
    window.scrollTo(0,0);
});

document.getElementById('changeLanguageButton_es').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;
    hashDelete('lang');
    hashAdd('lang=es');
    thingsChanged.lang = 'es';
    languageAtStart();
    actualMenu = 'main';
    changeLanguageMenu.hidden = true;
    mainMenu.hidden = false;
});

document.getElementById('changeLanguageButton_en').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;
    hashDelete('lang');
    hashAdd('lang=en');
    thingsChanged.lang = 'en';
    languageAtStart();
    actualMenu = 'main';
    changeLanguageMenu.hidden = true;
    mainMenu.hidden = false;
})