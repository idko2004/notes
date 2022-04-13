start();

async function start()
{
    theSecretThingThatNobodyHasToKnow = getKey('_login');
    let login = theSecretThingThatNobodyHasToKnow;
    console.log(login);

    if(location.hash === '#local')
    {
        theSecretThingThatNobodyHasToKnow = 'local';
        console.log('Forzar modo local');
        isLocalMode = true;

        document.getElementById('loginScreen').hidden = true;
        loadingScreen.hidden = true;

        loadNotesList();
        document.getElementById('noteScreen').hidden = false;

        menuButtonText();
    }
    else if(login === null || login === undefined || login === 'undefined')
    {
        loadingScreen.hidden = true;
        document.getElementById('noteScreen').hidden = true;
        document.getElementById('loginScreen').hidden = false;
    }
    else if(login === 'local')
    {
        console.log('Modo local');
        isLocalMode = true;

        document.getElementById('loginScreen').hidden = true;
        loadingScreen.hidden = true;

        loadNotesList();
        document.getElementById('noteScreen').hidden = false;
        
        menuButtonText();
    }
    else
    {
        isLocalMode = false;
        try
        {
            const response = await axios.get(`${path}/iHaveAValidKey`, {headers:{key: login}});
            if(response.data.iHaveAValidKey === 'yesYouHave')
            {
                loadNotesList();
                menuButtonText();
                resizeTwice();
            }
            else
            {
                //No tenemos una clave válida
                deleteKey('_login');
                theSecretThingThatNobodyHasToKnow = undefined;
                loadingScreen.hidden = true;
                document.getElementById('noteScreen').hidden = true;
                document.getElementById('loginScreen').hidden = false;
            }
        }
        catch
        {
            loadingScreen.hidden = true;
            floatingWindow(
            {
                title: 'Vaya...',
                text: 'Parece que nuestro servidor se ha caído.\nPuedes recargar la página para ver si ha vuelto, o usar el modo local, solo ten en cuenta que tus notas no se subirán a la nube.',
                buttons:
                [
                    {
                        text: 'Modo local',
                        primary: false,
                        callback: function()
                        {
                            console.log('Modo local');
                            theSecretThingThatNobodyHasToKnow = 'local';
                            isLocalMode = true;

                            document.getElementById('loginScreen').hidden = true;
                            loadingScreen.hidden = true;
                    
                            loadNotesList();
                            document.getElementById('noteScreen').hidden = false;

                            closeWindow();

                            menuButtonText();
                            resizeTwice();
                        }
                    },
                    {
                        text: 'Reintentar',
                        primary: true,
                        callback: function()
                        {
                            location.reload();
                        }
                    }
                ]
            });
        }
    }
}