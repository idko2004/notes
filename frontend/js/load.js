start();

function start()
{
    theSecretThingThatNobodyHasToKnow = getKey('_login');
    let login = theSecretThingThatNobodyHasToKnow;
    console.log(login);

    if(login === null || login === undefined || login === 'undefined')
    {
        loadingScreen.hidden = true;
        document.getElementById('noteScreen').hidden = true;
        document.getElementById('loginScreen').hidden = false;
    }
    else if(login === 'local')
    {
        console.log('Modo local');

        document.getElementById('loginScreen').hidden = true;
        loadingScreen.hidden = true;

        loadNotesList();
        document.getElementById('noteScreen').hidden = false;
    }
    else
    {
        //TODO: comprobar si la clave que tenemos es válida de antemano.
        loadNotesList();
        menuButtonText();
        resizeTwice();
    }
}