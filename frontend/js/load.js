elementsInHashAtStart();
start();

async function start()
{
    theSecretThingThatNobodyHasToKnow = getKey('_login');
    let login = theSecretThingThatNobodyHasToKnow;

    theOtherSecretThing = getKey('_pswrd');

    //Forzar modo local
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
        theActualThing = 'note';
    }
    //No hay datos guardados
    else if([null, undefined, 'undefined', ''].includes(login) || [null, undefined, 'undefined', ''].includes(theOtherSecretThing))
    {
        await requestLoginPassword();
        loadingScreen.hidden = true;
        document.getElementById('noteScreen').hidden = true;
        document.getElementById('loginScreen').hidden = false;
        /*floatingWindow(
        {
            title: 'Aún estamos en desarrollo',
            text: 'Por el momento sólo está disponible el modo local.',
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });*/
        theActualThing = 'login';
    }
    //Modo local
    else if(login === 'local')
    {
        console.log('Modo local');
        isLocalMode = true;

        document.getElementById('loginScreen').hidden = true;
        loadingScreen.hidden = true;

        loadNotesList();
        document.getElementById('noteScreen').hidden = false;

        menuButtonText();
        theActualThing = 'note';
    }
    //Hay una clave guardada
    else
    {
        isLocalMode = false;

        try
        {
            const response = await axios.post(`${path}/iHaveAValidKey`, {key: login});

            if(response.data.iHaveAValidKey === 'yesYouHave')
            {
                checkLocalCopyValue();
                await loadNotesList();
                menuButtonText();
                resizeTwice();
                theActualThing = 'note';
            }
            else
            {
                //No tenemos una clave válida
                deleteKey('_login');
                deleteKey('_pswrd');
                theSecretThingThatNobodyHasToKnow = undefined;
                theOtherSecretThing = undefined;
                await requestLoginPassword();
                loadingScreen.hidden = true;
                document.getElementById('noteScreen').hidden = true;
                document.getElementById('loginScreen').hidden = false;
                theActualThing = 'login';
            }
        }
        catch
        {
            loadingScreen.hidden = true;
            theActualThing = 'ventana';
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
                            closeWindow(function()
                            {
                                console.log('Modo local');
                                theSecretThingThatNobodyHasToKnow = 'local';
                                theOtherSecretThing = undefined;
                                isLocalMode = true;

                                document.getElementById('loginScreen').hidden = true;
                                loadingScreen.hidden = true;

                                loadNotesList();
                                document.getElementById('noteScreen').hidden = false;

                                menuButtonText();
                                resizeTwice();
                                hashAdd('local');
                                theActualThing = 'note';
                            });
                        }
                    },
                    {
                        text: getText('tryAgain'),
                        primary: true,
                        callback: function()
                        {
                            closeWindow(function()
                            {
                                location.reload();
                            })
                        }
                    }
                ]
            });
        }
    }
}

function elementsInHashAtStart()
{
    //Tema
    const colorTheme = hashEquals('colortheme');
    if(colorTheme !== undefined)
    {
        saveKey('_theme', colorTheme);
        hashDelete('colortheme');
        location.reload();
    }

    //Idioma
    const hashLang = hashEquals('lang');
    if(hashLang !== undefined)
    {
        saveKey('_lang', hashLang);
        hashDelete('lang');
        console.log('Idioma guardado mediante hash');
    }

    //Copias de notas locales
    const hashLocalCopy = hashEquals('localcopy');
    if(hashLocalCopy !== undefined)
    {
        saveKey('_localCopy', hashLocalCopy);
        hashDelete('localcopy');
        console.log('Configuración de notas locales cambiada mediante hash');
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

function checkLocalCopyValue()
{
    const localCopyKey = getKey('_localCopy');
    if(localCopyKey === 'true') localCopy = true;
    else if(localCopyKey === 'false') localCopy = false;
    else localCopy = true;
}
