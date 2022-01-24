start();

function start()
{
    let login = getKey('_login');

    if(login === null)
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
}