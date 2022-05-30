const menuButton = document.getElementById('menuButton');
const menuTitleText = document.getElementById('menuTitleText');
const closeMenuButton = document.getElementById('closeMenuButton');
const menuExitLocalMode = document.getElementById('menuExitLocalMode');
const menuEraseAll = document.getElementById('menuEraseAll');
const menuOnlineManageAccount = document.getElementById('menuOnlineManageAccount');
const menuOnlineLogOut = document.getElementById('menuOnlineLogOut');
const menuOnlineChangeToLocal = document.getElementById('menuOnlineChangeToLocal');
const menuChangeLanguage = document.getElementById('menuChangeLanguage');

async function menuButtonText()
{
    if(isLocalMode)
    {
        menuButton.innerText = getText('localMode');
        menuTitleText.innerText = getText('localMode');

        menuExitLocalMode.hidden = false;
        menuEraseAll.hidden = false;
        menuChangeLanguage.hidden = false;

        menuOnlineLogOut.hidden = true;
        menuOnlineManageAccount.hidden = true;
        menuOnlineChangeToLocal.hidden = true;
    }
    else
    {
        menuButton.innerText = getText('someoneAccount');

        menuExitLocalMode.hidden = true;
        menuEraseAll.hidden = true;
        menuChangeLanguage.hidden = true;

        menuOnlineLogOut.hidden = false;
        menuOnlineManageAccount.hidden = false;
        menuOnlineChangeToLocal.hidden = false;

        //Obtener nombre de usuario
        try
        {
            const response = await axios.get(`${path}/getUsername`, {headers: {key: theSecretThingThatNobodyHasToKnow}});
            menuButton.innerText = response.data.username;
            menuTitleText.innerText = response.data.username;
        }
        catch
        {
            menuButton.innerText = getText('someoneAccount');
            menu.innerText = getText('someoneAccount');
        }
    }
}

menuButton.addEventListener('click', function()
{
    floatingMenu.hidden = false;
    canInteract = false;
});

closeMenuButton.addEventListener('click', function()
{
    floatingMenu.hidden = true;
    canInteract = true;
});

//Botón de cerrar sesión
menuOnlineLogOut.addEventListener('click', async function()
{
    if(isLocalMode) return;
    deleteKey('_login');

    floatingMenu.hidden = true;
    floatingWindow(
    {
        title: getText('logginOut')
    });

    try
    {
        const response = await axios.post(`${path}/logout`, {key: theSecretThingThatNobodyHasToKnow});
        if(response.data.ok) console.log('Sesión cerrada');
    }
    catch
    {
        location.reload();
    }
    location.reload();
});

//Botón de cambiar a modo local
menuOnlineChangeToLocal.addEventListener('click', function()
{
    if(isLocalMode) return;
    localCopy = undefined;
    hashAdd('local');
    location.reload();
});

//Botón de gestionar cuenta
menuOnlineManageAccount.addEventListener('click', async function()
{
    if(isLocalMode) return;

    document.getElementById('noteScreen').hidden = true;
    floatingMenu.hidden = true;
    loadingScreen.hidden = false;

    await saveNote();
    saveCookie('_login', theSecretThingThatNobodyHasToKnow);
    saveCookie('_localCopy', localCopy);
    location.href = `manageAccount.html#lang=${actualLanguage}`;
});

//Botón de salir del modo local
menuExitLocalMode.addEventListener('click', async function()
{
    if(hashContains('local'))
    {
        hashDelete('local');
        location.reload();
        return;
    }

    await saveNote();
    document.getElementById('noteScreen').hidden = true;
    notesList.innerHTML = '';
    noteName.innerText = getText('clickANote');
    textArea.value = '';
    textArea.disabled = true;

    document.getElementById('loginScreen').hidden = false;
    floatingMenu.hidden = true;

    theSecretThingThatNobodyHasToKnow = undefined;
    deleteKey('_login');

    canInteract = true;
});

//Botón de cambiar de idioma en modo local
menuChangeLanguage.addEventListener('click', function()
{
    if(!isLocalMode) return;

    saveNote();
    switch(actualLanguage)
    {
        case 'es':
            saveKey('_lang', 'en');
            break;

        case 'en':
            saveKey('_lang', 'es');
            break;

        default:
            saveKey('_lang', 'en');
            break;
    }
    location.reload();
});

//Botón borrar todas las notas
menuEraseAll.addEventListener('click', function()
{
    if(!isLocalMode) return;

    floatingMenu.hidden = true;
    if(theSecretThingThatNobodyHasToKnow === 'local') floatingWindow(
    {
        title: getText('menu_eraseAllLocal_title'),
        text: getText('menu_eraseAllLocal_text'),
        buttons:
        [
            {
                text: getText('menu_eraseAllLocal_btn1'),
                primary: false,
                callback: () => {closeWindow()}
            },
            {
                text: getText('menu_eraseAllLocal_btn2'),
                primary: true,
                callback: () =>
                {
                    closeWindow();
                    floatingWindow(
                    {
                        title: getText('menu_reallyEraseAll_title'),
                        buttons:
                        [
                            {
                                text: getText('menu_reallyEraseAll_btn1'),
                                primary: true,
                                callback: () =>
                                {
                                    document.getElementById('noteScreen').hidden = true;
                                    loadingScreen.hidden = false;
                                    const key = getKey('_login');
                                    localStorage.clear();
                                    if(key !== undefined) saveKey('_login', key);
                                    location.reload();
                                }
                            },
                            {
                                text: getText('menu_reallyEraseAll_btn2'),
                                primary: false,
                                callback: () => {closeWindow()}
                            }
                        ]
                    });
                }
            }
        ]
    });
});