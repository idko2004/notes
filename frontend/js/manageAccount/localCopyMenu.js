
function updateLocalCopyEnabledText()
{
    const text = document.getElementById('localCopyEnabledText');
    const button = document.getElementById('localCopyChangeButton');
    if(saveNotesLocally === 'true')
    {
        text.innerText = getText('enabled');
        button.innerText = getText('disableLocalCopy');
    }
    else
    {
        text.innerText = getText('disabled');
        button.innerText = getText('enableLocalCopy');
    }
}

document.getElementById('localCopyChangeButton').addEventListener('click', function()
{
    if(actualMenu !== 'localCopy' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        localCopyMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);
        localCopyMenu.removeEventListener('animationend', endAnimationCallback);
    }

    if(saveNotesLocally === 'true')
    {
        saveNotesLocally = 'false';
        thingsChanged.localCopy = 'false';
    }
    else
    {
        saveNotesLocally = 'true';
        thingsChanged.localCopy = 'true';
    }

    localCopyMenu.classList.remove('openMenu');
    localCopyMenu.classList.add('closeMenu');
    localCopyMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('localCopyCancelButton').addEventListener('click', function()
{
    if(actualMenu !== 'localCopy' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        localCopyMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);
        localCopyMenu.removeEventListener('animationend', endAnimationCallback);
    }

    localCopyMenu.classList.remove('openMenu');
    localCopyMenu.classList.add('closeMenu');
    localCopyMenu.addEventListener('animationend', endAnimationCallback);
});