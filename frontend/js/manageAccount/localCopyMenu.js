
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
    if(actualMenu !== 'localCopy') return;

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
    localCopyMenu.hidden = true;
    mainMenu.hidden = false;
    actualMenu = 'main';
    window.scrollTo(0,0);
});

document.getElementById('localCopyCancelButton').addEventListener('click', function()
{
    if(actualMenu !== 'localCopy') return;

    localCopyMenu.hidden = true;
    mainMenu.hidden = false;
    actualMenu = 'main';
    window.scrollTo(0,0);
});