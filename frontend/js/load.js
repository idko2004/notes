elementsInHashAtStart();
//start(); ahora se llama desde elementsInHashAtStart()

async function start()
{
    loadIdPswrdAndLogin();

    console.log('load: login', theSecretThingThatNobodyHasToKnow);
    console.log('load: theOtherSecretThing', theOtherSecretThing);

    //Forzar modo local | modo local activo
    if(hashContains('local') || theSecretThingThatNobodyHasToKnow === 'local')
    {
        console.log('Forzar modo local');
        isLocalMode = true;

        document.getElementById('loginScreen').hidden = true;
        loadingScreen.hidden = true;

        loadNotesList();
        menuButtonText();
        spellcheckStatus();
        document.getElementById('noteScreen').hidden = false;
        theActualThing = 'note';
    }
    //No hay datos guardados
    else if([null, undefined, 'undefined', ''].includes(theSecretThingThatNobodyHasToKnow)
    || [null, undefined, 'undefined', ''].includes(theOtherSecretThing))
    {
        await requestLoginPassword();
        loadingScreen.hidden = true;
        document.getElementById('noteScreen').hidden = true;
        document.getElementById('loginScreen').hidden = false;
        theActualThing = 'login';
    }
    //Hay una clave guardada
    else
    {
        isLocalMode = false;

        try
        {
            console.log('http: comprobando si tenemos una clave válida');
            const response = await encryptHttpCall('/validKey',
            {
                deviceID,
                encrypt:
                {
                    key: theSecretThingThatNobodyHasToKnow
                }
            }, theOtherSecretThing);

            if(response.data.validKey)
            {
                console.log('Tenemos una clave válida');
                checkLocalCopyValue();
                await loadNotesList();
                menuButtonText();
                resizeTwice();
                spellcheckStatus();
                theActualThing = 'note';
            }
            else
            {
                //No tenemos una clave válida
                console.log('No tenemos una clave válida');
                deleteKey('_login');
                theSecretThingThatNobodyHasToKnow = undefined;
                theOtherSecretThing = undefined;
                await requestLoginPassword();
                loadingScreen.hidden = true;
                document.getElementById('noteScreen').hidden = true;
                document.getElementById('loginScreen').hidden = false;
                theActualThing = 'login';
            }
        }
        catch(err)
        {
            loadingScreen.hidden = true;
            theActualThing = 'ventana';

            console.log(err);

            floatingWindow(
            {
                title: getText('ups'),
                text: `${getText('load_fail')}\n\n${getText('errorCode')}: ${err.message}`,
                buttons:
                [
                    {
                        text: getText('localMode'),
                        primary: false,
                        callback: async function()
                        {
                            await closeWindow();
                            console.log('Modo local');
                            theSecretThingThatNobodyHasToKnow = 'local';
                            theOtherSecretThing = undefined;
                            deviceID = undefined;
                            isLocalMode = true;

                            document.getElementById('loginScreen').hidden = true;
                            loadingScreen.hidden = true;

                            loadNotesList();
                            document.getElementById('noteScreen').hidden = false;

                            menuButtonText();
                            spellcheckStatus();
                            resizeTwice();
                            hashAdd('local');
                            theActualThing = 'note';
                        }
                    },
                    {
                        text: getText('tryAgain'),
                        primary: true,
                        callback: async function()
                        {
                            await closeWindow();
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
    //////Borrar todo//////
    if(hashContains('deleteall'))
    {
        loadingScreen.hidden = true;
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('menu_reallyEraseAll_title'),
            text: getText('menu_eraseAllLocal_text'),
            buttons:
            [
                {
                    text: getText('menu_reallyEraseAll_btn2'),
                    primary: false,
                    callback: async function()
                    {
                        await closeWindow();
                        hashDelete('deleteall');
                        location.reload();
                    }
                },
                {
                    text: getText('menu_reallyEraseAll_btn1'),
                    primary: true,
                    callback: async function()
                    {
                        await closeWindow();
                        const allKeys = getKeyNames();
                        for (let i = 0; i < allKeys.length; i++)
                        {
                            deleteKey(allKeys[i]);
                        }
                        hashDelete('deleteall');
                        location.reload();
                    }
                }
            ]
        });
        return;
    }

    //////Borrar configuración//////
    if(hashContains('deleteconfig'))
    {
        loadingScreen.hidden = true;
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('deleteConfigQuestion'),
            text: getText('deleteConfigText'),
            buttons:
            [
                {
                    text: getText('menu_eraseAllLocal_btn1'),
                    primary: false,
                    callback: async function()
                    {
                        await closeWindow();
                        hashDelete('deleteconfig');
                        location.reload();
                    }
                },
                {
                    text: getText('deleteConfigurationData'),
                    primary: true,
                    callback: async function()
                    {
                        await closeWindow();
                        const allKeys = getKeyNames();
                        for(let i = 0; i < allKeys.length; i++)
                        {
                            if(allKeys[i].startsWith('_')) deleteKey(allKeys[i]);
                        }
                        hashDelete('deleteconfig');
                        location.reload();
                    }
                }
            ]
        });
        return;
    }

    //////Tema//////
    const colorTheme = hashEquals('colortheme');
    if(colorTheme !== undefined)
    {
        saveKey('_theme', colorTheme);
        hashDelete('colortheme');
        location.reload();
        return;
    }

    //////Idioma//////
    const hashLang = hashEquals('lang');
    if(hashLang !== undefined)
    {
        saveKey('_lang', hashLang);
        hashDelete('lang');
        console.log('Idioma guardado mediante hash');
    }

    //////Copias de notas locales//////
    const hashLocalCopy = hashEquals('localcopy');
    if(hashLocalCopy !== undefined)
    {
        saveKey('_localCopy', hashLocalCopy);
        hashDelete('localcopy');
        console.log('Configuración de notas locales cambiada mediante hash');
    }

    //////spellcheck//////
    const hashSpellcheck = hashEquals('spellcheck');
    if(hashSpellcheck !== undefined)
    {
        saveKey('_spellcheck', hashSpellcheck);
        hashDelete('spellcheck');
        console.log('Spellcheck cambiado mediante hash');
    }

    //////Cerrar sesión//////
    if(hashContains('logout'))
    {
        loadingScreen.hidden = true;
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('logOut'),
            text: getText('askToLogOut'),
            buttons:
            [
                {
                    text: getText('keepSessionOpen'),
                    primary: false,
                    callback: async function()
                    {
                        await closeWindow();
                        hashDelete('logout');
                        start();
                    }
                },
                {
                    text: getText('logOut'),
                    primary: true,
                    callback: async function()
                    {
                        await closeWindow();
                        deleteKey('_login');
                        theSecretThingThatNobodyHasToKnow = undefined;
                        hashDelete('logout');
                        console.log('Sesión cerrada mediante hash');
                        start();
                    }
                }
            ]
        });
        return;
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

function spellcheckStatus()
{
    let value = getKey('_spellcheck');
    if(value === 'true') textArea.setAttribute('spellcheck', 'true');
    else if(value === 'false') textArea.setAttribute('spellcheck', 'false');
}