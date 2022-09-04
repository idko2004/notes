document.getElementById('changeLanguageButton_cancel').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        changeLanguageMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);
        changeLanguageMenu.removeEventListener('animationend', endAnimationCallback);
    }

    changeLanguageMenu.classList.remove('openMenu');
    changeLanguageMenu.classList.add('closeMenu');
    changeLanguageMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('changeLanguageButton_es').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        thingsChanged.lang = 'es';
        hashDelete('lang');
        hashAdd('lang=es');
        languageAtStart();
        actualMenu = 'main';

        changeLanguageMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');
        changeLanguageMenu.removeEventListener('animationend', endAnimationCallback);
    
    }
    changeLanguageMenu.classList.remove('openMenu');
    changeLanguageMenu.classList.add('closeMenu');
    changeLanguageMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('changeLanguageButton_en').addEventListener('click', function()
{
    if(actualMenu !== 'changeLanguage') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        thingsChanged.lang = 'en';
        hashDelete('lang');
        hashAdd('lang=en');
        languageAtStart();
        actualMenu = 'main';

        changeLanguageMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');
        changeLanguageMenu.removeEventListener('animationend', endAnimationCallback);
    
    }
    changeLanguageMenu.classList.remove('openMenu');
    changeLanguageMenu.classList.add('closeMenu');
    changeLanguageMenu.addEventListener('animationend', endAnimationCallback);
});