elementsInHashAtStart();
start();

async function start()
{
    theSecretThingThatNobodyHasToKnow = getKey('_login');
    let login = theSecretThingThatNobodyHasToKnow;
    console.log(login);

    if(hashContains('local'))
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
        floatingWindow(
        {
            title: 'Aún estamos en desarrollo',
            text: 'Por el momento sólo está disponible el modo local.',
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });
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
                title: getText('ups'),
                text: getText('load_fail'),
                buttons:
                [
                    {
                        text: getText('localMode'),
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
                        text: getText('tryAgain'),
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

function elementsInHashAtStart()
{
    //Idioma
    const hashLang = hashEquals('lang');
    if(hashLang !== undefined)
    {
        saveKey('_lang', hashLang);
        hashDelete('lang');
        console.log('Idioma guardado mediante hash');
    }

    //Cerrar sesión
    if(hashContains('logout'))
    {
        deleteKey('_login');
        theSecretThingThatNobodyHasToKnow = undefined;
        hashDelete('logout');
        console.log('Sesión cerrada mediante hash');
    }
}