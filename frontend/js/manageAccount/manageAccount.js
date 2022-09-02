const path = 'http://localhost:8888';

let username;
let email;
let passwordLength;
let theSecretThingThatNobodyHaveToKnow;
let saveNotesLocally;
const thingsChanged =
{
    lang: undefined,
    localCopy: undefined,
    colorTheme: undefined
}

let isLocalMode;
let actualMenu;
//  main
//  changeData
//  changeDataEmailCode
//  changeDataComprobingCode
//  changeLanguage
//  logOutInAll
//  deleteAccount
//  deleteAccountEmailCode
//  localCopy
//  colorTheme
//  ventana

const loadingScreen = document.getElementById('loadingScreen');
const mainScreen = document.getElementById('mainScreen');

const mainMenu = document.getElementById('mainMenu');
const changeDataMenu = document.getElementById('changeDataMenu');
const changeDataEmailCodeMenu = document.getElementById('changeDataEmailCodeMenu');
const changeLanguageMenu = document.getElementById('changeLanguageMenu');
const logOutInAllMenu = document.getElementById('logOutInAllMenu');
const deleteAccountMenu = document.getElementById('deleteAccountMenu');
const deleteAccountEmailCodeMenu = document.getElementById('deleteAccountEmailCodeMenu');
const localCopyMenu = document.getElementById('localCopyMenu');
const colorThemeMenu = document.getElementById('changeColorThemeMenu');

const emailSpace = document.getElementById('emailSpace');
const usernameSpace = document.getElementById('usernameSpace');
const passwordSpace = document.getElementById('passwordSpace');

start();

async function start()
{
    theSecretThingThatNobodyHaveToKnow = getSpecificCookie('_login');
    theOtherSecretThing = getSpecificCookie('_pswrd');
    saveNotesLocally = getSpecificCookie('_localCopy');

    //Cargar el modo local
    if(theSecretThingThatNobodyHaveToKnow === 'local')
    {
        isLocalMode = true;
        mainMenu.hidden = false;
        loadingScreen.hidden = true;
        mainScreen.hidden = false;
        actualMenu = 'main';

        //Ocultar menuses que no tienen que estar
        document.getElementById('modifyUserDataSection').hidden = true;
        document.getElementById('logOutSection').hidden = true;

        document.getElementById('toLocalCopyMenuButton').hidden = true;

        document.getElementById('manageAccountText').innerText = getText('preferences');
    }
    //Cargar el modo online
    else
    {
        isLocalMode = false;

        if([theSecretThingThatNobodyHaveToKnow, saveNotesLocally, theOtherSecretThing].includes(null)
        || [theSecretThingThatNobodyHaveToKnow, saveNotesLocally, theOtherSecretThing].includes(undefined)
        || [theSecretThingThatNobodyHaveToKnow, saveNotesLocally, theOtherSecretThing].includes(''))
        {
            loadingScreen.hidden = true;
            floatingWindow(
            {
                title: getText('reenter'),
                text: getText('reenter_manageAccount'),
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            location.href = 'index.html';
                        })
                    }
                }
            });
            return;
        }

        //Comprobar que tenemos una clave válida y obtener el nombre de usuario
        try
        {
            const usernameCall = await encryptHttpCall('/getUsername', {key: theSecretThingThatNobodyHaveToKnow}, theOtherSecretThing);
            console.log(usernameCall);

            if(usernameCall.data.error === 'invalidKey')
            {
                loadingScreen.hidden = true;
                floatingWindow(
                {
                    title: 'Clave no válida',
                    button:
                    {
                        text: 'Aceptar',
                        callback: function()
                        {
                            closeWindow(function()
                            {
                                location.href = 'index.html';
                            })
                        }
                    }
                });
                return;
            }
            else if(usernameCall.data.decrypt.username === undefined)
            {
                loadingScreen.hidden = true;
                floatingWindow(
                {
                    title: 'Error',
                    text: `${usernameCall.data.error}`,
                    button:
                    {
                        text: 'Aceptar',
                        callback: function()
                        {
                            closeWindow(function()
                            {
                                location.href = 'index.html';
                            })
                        }
                    }
                });
                return;
            }

            username = usernameCall.data.decrypt.username;
            email = usernameCall.data.decrypt.email;
            passwordLength = usernameCall.data.decrypt.passwordLength;
            updateUserData();
            mainMenu.hidden = false;
            loadingScreen.hidden = true;
            mainScreen.hidden = false;
            actualMenu = 'main';
        }
        catch
        {
            loadingScreen.hidden = true;
            floatingWindow(
            {
                title: 'Vaya...',
                text: 'Parece que el servidor se ha caído, prueba a intentar de nuevo dentro de un rato.',
                button:
                {
                    text: 'Aceptar',
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            location.href = 'index.html';
                        })
                    }
                }
            });
            return;
        }
    }
}

function updateUserData()
{
    usernameSpace.innerText = username;
    emailSpace.innerText = email;
    let pswrd = '';
    for(let i = 0; i < passwordLength; i++)
    {
        pswrd += '*';
    }
    passwordSpace.innerText = pswrd;
}

document.getElementById('toChangeDataMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        mainMenu.hidden = true;
        changeDataMenu.hidden = false;

        changeDataMenu.classList.remove('closeMenu');
        changeDataMenu.classList.add('openMenu');

        actualMenu = 'changeData';
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
    }

    updateDataMenuPlaceholders();

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('toChangeLanguageMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        mainMenu.hidden = true;
        changeLanguageMenu.hidden = false;

        changeLanguageMenu.classList.remove('closeMenu');
        changeLanguageMenu.classList.add('openMenu');

        actualMenu = 'changeLanguage';
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
    }

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('toChangeColorTheme').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        mainMenu.hidden = true;
        colorThemeMenu.hidden = false;

        colorThemeMenu.classList.remove('closeMenu');
        colorThemeMenu.classList.add('openMenu');

        actualMenu = 'colorTheme';
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
    }

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('toLocalCopyMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        mainMenu.hidden = true;
        localCopyMenu.hidden = false;

        localCopyMenu.classList.remove('closeMenu');
        localCopyMenu.classList.add('openMenu');

        actualMenu = 'localCopy';
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
    }

    updateLocalCopyEnabledText();

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('logOutInAllMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;
        mainMenu.hidden = true;
        logOutInAllMenu.hidden = false;

        logOutInAllMenu.classList.remove('closeMenu');
        logOutInAllMenu.classList.add('openMenu');

        actualMenu = 'logOutInAll';
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
    }

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('deleteAccountMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        mainMenu.hidden = true;
        deleteAccountMenu.hidden = false;

        deleteAccountMenu.classList.remove('closeMenu');
        deleteAccountMenu.classList.add('openMenu');
        
        actualMenu = 'deleteAccount';
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
    }

    updateDeleteAccountPlaceholders();

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('goBackToNotes').addEventListener('click', function()
{
    mainScreen.hidden = true;
    loadingScreen.hidden = false;

    let str = 'index.html#';

    if(thingsChanged.lang !== undefined)
    {
        str += `lang=${thingsChanged.lang};`;
    }
    if(thingsChanged.localCopy !== undefined)
    {
        str += `localcopy=${thingsChanged.localCopy};`;
    }
    if(thingsChanged.colorTheme !== undefined)
    {
        str += `colortheme=${thingsChanged.colorTheme};`;
    }

    str = str.slice(0, -1);
    location.href = str;
});
