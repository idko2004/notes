function updateSpellcheckText()
{
    let text;

    console.log('spellcheckConfig', spellcheckConfig);
    switch(spellcheckConfig)
    {
        case 'true': text = getText('enabled'); break;
        case 'false': text = getText('disabled'); break;
        default: text = 'Por defecto'; break;
    }

    document.getElementById('spellcheckText').innerText = text;
}

document.getElementById('spellcheckButton_cancel').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        spellcheckMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0, 0);
        spellcheckMenu.removeEventListener('animationend', endAnimationCallback);
    }

    spellcheckMenu.classList.remove('openMenu');
    spellcheckMenu.classList.add('closeMenu');
    spellcheckMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('spellcheckButton_enable').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        spellcheckMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0, 0);
        spellcheckMenu.removeEventListener('animationend', endAnimationCallback);
    }

    thingsChanged.spellcheck = 'true';
    spellcheckConfig = 'true';

    spellcheckMenu.classList.remove('openMenu');
    spellcheckMenu.classList.add('closeMenu');
    spellcheckMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('spellcheckButton_disable').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        spellcheckMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0, 0);
        spellcheckMenu.removeEventListener('animationend', endAnimationCallback);
    }

    thingsChanged.spellcheck = 'false';
    spellcheckConfig = 'false';

    spellcheckMenu.classList.remove('openMenu');
    spellcheckMenu.classList.add('closeMenu');
    spellcheckMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('spellcheckButton_default').addEventListener('click', function()
{
    if(actualMenu !== 'spellcheck') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        spellcheckMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0, 0);
        spellcheckMenu.removeEventListener('animationend', endAnimationCallback);
    }

    thingsChanged.spellcheck = 'default';
    spellcheckConfig = 'default';

    spellcheckMenu.classList.remove('openMenu');
    spellcheckMenu.classList.add('closeMenu');
    spellcheckMenu.addEventListener('animationend', endAnimationCallback);
});