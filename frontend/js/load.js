elementsInHashAtStart();
//start(); ahora se llama desde elementsInHashAtStart()

async function start()
{
    theSecretThingThatNobodyHasToKnow = getKey('_login');
    let login = theSecretThingThatNobodyHasToKnow;

    theOtherSecretThing = getKey('_pswrd');

    //Forzar modo local | modo local activo
    if(hashContains('local') || login === 'local')
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
    //Hay una clave guardada
    else
    {
        isLocalMode = false;

        try
        {
            console.log('http: comprobando si tenemos una clave válida');
            const response = await axios.post(`${path}/iHaveAValidKey`, {key: login});

            if(response.data.iHaveAValidKey === 'yesYouHave')
            {
                console.log('Sí, tenemos una clave válida');
                checkLocalCopyValue();
                await loadNotesList();
                menuButtonText();
                resizeTwice();
                theActualThing = 'note';
            }
            else
            {
                //No tenemos una clave válida
                console.log('No, no tenemos una clave válida');
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
    //Borrar todo
    if(hashContains('deleteall'))
    {
        loadingScreen.hidden = true;
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: '¿Borrar todos los datos?',
            text: 'Se borrarán todos los datos locales, tus notas seguirán a salvo en tu cuenta, pero se borrarán sus copias locales. Tus configuraciones también serán borradas',
            buttons:
            [
                {
                    text: 'No borrar nada',
                    primary: false,
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            hashDelete('deleteall');
                            location.reload();
                        });
                    }
                },
                {
                    text: 'Borrar todo',
                    primary: true,
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            const allKeys = getKeyNames();
                            for (let i = 0; i < allKeys.length; i++)
                            {
                                deleteKey(allKeys[i]);
                            }
                            hashDelete('deleteall');
                            location.reload();
                        });
                    }
                }
            ]
        });
        return;
    }

    //Borrar configuración
    if(hashContains('deleteconfig'))
    {
        loadingScreen.hidden = true;
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: '¿Borrar configuraciones?',
            text: 'Se borrarán todos los datos de configuración, tus notas se mantendrán a salvo.',
            buttons:
            [
                {
                    text: 'No borrar nada',
                    primary: false,
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            hashDelete('deleteconfig');
                            location.reload();
                        });
                    }
                },
                {
                    text: 'Borrar configuraciones',
                    primary: true,
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            const allKeys = getKeyNames();
                            for(let i = 0; i < allKeys.length; i++)
                            {
                                if(allKeys[i].startsWith('_')) deleteKey(allKeys[i]);
                            }
                            hashDelete('deleteconfig');
                            location.reload();
                        })
                    }
                }
            ]
        });
        return;
    }

    //Tema
    const colorTheme = hashEquals('colortheme');
    if(colorTheme !== undefined)
    {
        saveKey('_theme', colorTheme);
        hashDelete('colortheme');
        location.reload();
        return;
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

    start();
}

function checkLocalCopyValue()
{
    const localCopyKey = getKey('_localCopy');
    if(localCopyKey === 'true') localCopy = true;
    else if(localCopyKey === 'false') localCopy = false;
    else localCopy = true;
}
