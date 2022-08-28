const floatingMenu = document.getElementById('floatingMenu');
const theMenu = document.getElementById('menu');
const menuButton = document.getElementById('menuButton');
const menuTitleText = document.getElementById('menuTitleText');
const closeMenuButton = document.getElementById('closeMenuButton');
const menuExitLocalMode = document.getElementById('menuExitLocalMode');
//const menuEraseAll = document.getElementById('menuEraseAll');
const menuOnlineManageAccount = document.getElementById('menuOnlineManageAccount');
const menuOnlineLogOut = document.getElementById('menuOnlineLogOut');
const menuOnlineChangeToLocal = document.getElementById('menuOnlineChangeToLocal');
//const menuChangeLanguage = document.getElementById('menuChangeLanguage');
const menuSettingsLocal = document.getElementById('menuSettingsLocal');

let menuAnimationCallback;

async function menuButtonText()
{
    if(isLocalMode)
    {
        menuButton.innerText = getText('localMode');
        menuTitleText.innerText = getText('localMode');

        menuExitLocalMode.hidden = false;
        //menuEraseAll.hidden = false;
        //menuChangeLanguage.hidden = false;
        menuSettingsLocal.hidden = false;

        menuOnlineLogOut.hidden = true;
        menuOnlineManageAccount.hidden = true;
        menuOnlineChangeToLocal.hidden = true;
    }
    else
    {
        menuButton.innerText = getText('someoneAccount');

        menuExitLocalMode.hidden = true;
        //menuEraseAll.hidden = true;
        //menuChangeLanguage.hidden = true;
        menuSettingsLocal.hidden = true;

        menuOnlineLogOut.hidden = false;
        menuOnlineManageAccount.hidden = false;
        menuOnlineChangeToLocal.hidden = false;

        //Obtener nombre de usuario
        try
        {
            //const response = await axios.get(`${path}/getUsername`, {headers: {key: theSecretThingThatNobodyHasToKnow}});
            const response = await encryptHttpCall('/getUsername', {key: theSecretThingThatNobodyHasToKnow}, theOtherSecretThing);
            menuButton.innerText = response.data.decrypt.username;
            menuTitleText.innerText = response.data.decrypt.username;
        }
        catch
        {
            menuButton.innerText = getText('someoneAccount');
            menuTitleText.innerText = getText('someoneAccount');
        }
    }
}

function animationMenuOpen()
{
    floatingMenu.hidden = false;
    theMenu.classList.remove('closeWinSlide');
    theMenu.classList.add('openWinSlide');

    floatingMenu.classList.remove('closeBg');
    floatingMenu.classList.add('openBg');
}

function animationMenuClose(callback)
{
    theMenu.classList.remove('openWinSlide');
    theMenu.classList.add('closeWinSlide');

    floatingMenu.classList.remove('openBg');
    floatingMenu.classList.add('closeBg');

    menuAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeWindowSlide') return;
        floatingMenu.hidden = true;
        theMenu.removeEventListener('animationend', menuAnimationCallback);
        if(callback !== undefined && typeof callback === 'function') callback();
    }

    theMenu.addEventListener('animationend', menuAnimationCallback);
}

menuButton.addEventListener('click', function()
{
    if(theActualThing !== 'note') return;
    floatingMenu.hidden = false;
    canInteract = false;
    theActualThing = 'menu';
    animationMenuOpen();
});

closeMenuButton.addEventListener('click', function()
{
    if(theActualThing !== 'menu') return;
    canInteract = true;
    theActualThing = 'note';
    animationMenuClose();
});

//Botón de cerrar sesión
menuOnlineLogOut.addEventListener('click', async function()
{
    if(theActualThing !== 'menu') return;
    if(isLocalMode) return;
    deleteKey('_login');

    document.title = getText('logginOut');
    animationMenuClose();

    try
    {
        const response = await axios.post(`${path}/logout`, {key: theSecretThingThatNobodyHasToKnow});
        if(response.data.ok) console.log('Sesión cerrada');
    }
    catch
    {
        location.reload();
        return;
    }
    location.reload();
});

//Botón de cambiar a modo local
menuOnlineChangeToLocal.addEventListener('click', function()
{
    if(theActualThing !== 'menu') return;
    if(isLocalMode) return;
    localCopy = undefined;
    hashAdd('local');
    location.reload();
});

//Botón de gestionar cuenta
menuOnlineManageAccount.addEventListener('click', async function()
{
    if(theActualThing !== 'menu') return;
    if(isLocalMode) return;

    document.getElementById('noteScreen').hidden = true;
    floatingMenu.hidden = true;
    loadingScreen.hidden = false;

    await saveNote();
    saveCookie('_login', theSecretThingThatNobodyHasToKnow);
    saveCookie('_pswrd', theOtherSecretThing);
    saveCookie('_localCopy', localCopy);
    location.href = `manageAccount.html#lang=${actualLanguage};colortheme=${colorTheme}`;
});

//Botón de salir del modo local
menuExitLocalMode.addEventListener('click', function()
{
    if(theActualThing !== 'menu') return;

    animationMenuClose(async function()
    {
        await saveNote();

        if(hashContains('local'))
        {
            hashDelete('local');
            location.reload();
            return;
        }
    
        deleteKey('_login');
    
        location.reload();
    });
});

//Botón de cambiar de idioma en modo local
/*menuChangeLanguage.addEventListener('click', function()
{
    if(theActualThing !== 'menu') return;
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
    languageAtStart();
    updateBarButtonsHoverText();
    animationMenuClose();
    canInteract = true;
    theActualThing = 'note';
});*/

//Botón borrar todas las notas
/*menuEraseAll.addEventListener('click', function()
{
    if(theActualThing !== 'menu') return;
    if(!isLocalMode) return;

    theActualThing = 'ventana';
    if(theSecretThingThatNobodyHasToKnow === 'local')
    {
        animationMenuClose(
            floatingWindow(
            {
                title: getText('menu_eraseAllLocal_title'),
                text: getText('menu_eraseAllLocal_text'),
                buttons:
                [
                    {
                        text: getText('menu_eraseAllLocal_btn1'),
                        primary: false,
                        callback: () => {closeWindow(); theActualThing = 'note';}
                    },
                    {
                        text: getText('menu_eraseAllLocal_btn2'),
                        primary: true,
                        callback: () =>
                        {
                            closeWindow(
                                function()
                                {
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
                                                callback: () => {closeWindow(); theActualThing = 'note';}
                                            }
                                        ]
                                    });
                                }
                            );
                        }
                    }
                ]
            })
        );
    }
    else theActualThing = 'menu';
});*/

function localManageAccount()
{
    saveCookie('_login', 'local');
    location.href = `manageAccount.html#lang=${actualLanguage};colortheme=${colorTheme}`;
}

menuSettingsLocal.addEventListener('click', function()
{
    if (theActualThing !== 'menu') return;
    if (!isLocalMode) return;

    document.getElementById('noteScreen').hidden = true;
    floatingMenu.hidden = true;
    loadingScreen.hidden = false;

    saveNote();

    localManageAccount();
})