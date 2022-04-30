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
    location.reload();
    //location.href='index.html#lang=es';
});

document.getElementById('changeLanguageButton_en').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;
    hashDelete('lang');
    hashAdd('lang=en');
    location.reload();
    //location.href='index.html#lang=en';
})