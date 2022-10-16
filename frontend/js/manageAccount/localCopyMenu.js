document.getElementById('toLocalCopyMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main' || isLocalMode) return;

    actualMenu = 'localCopy';
    changeHashMenu('localCopy');
    updateLocalCopyEnabledText();

    animatedTransition(mainMenu, localCopyMenu);
});

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

    actualMenu = 'main';
    changeHashMenu('main');
    animatedTransition(localCopyMenu, mainMenu);
});

document.getElementById('localCopyCancelButton').addEventListener('click', function()
{
    if(actualMenu !== 'localCopy' || isLocalMode) return;

    actualMenu = 'main';
    changeHashMenu('main');
    animatedTransition(localCopyMenu, mainMenu);
});