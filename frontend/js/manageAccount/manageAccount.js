const path = 'http://localhost:3000';

let username;
let email;
let passwordLength;
let theSecretThingThatNobodyHaveToKnow;
let saveNotesLocally;
const thingsChanged =
{
    lang: undefined,
    localCopy: undefined
}

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

const floatWindow = document.getElementById('floatingWindow');
const windowTitle = document.getElementById('windowTitle');
const windowText = document.getElementById('windowText');
const windowInput = document.getElementById('windowInput');
const windowButtons = document.getElementById('windowButtons');

const emailSpace = document.getElementById('emailSpace');
const usernameSpace = document.getElementById('usernameSpace');
const passwordSpace = document.getElementById('passwordSpace');

start();

async function start()
{
    theSecretThingThatNobodyHaveToKnow = getSpecificCookie('_login');
    saveNotesLocally = getSpecificCookie('_localCopy');

    if([theSecretThingThatNobodyHaveToKnow, saveNotesLocally].includes(null))
    {
        loadingScreen.hidden = true;
        floatingWindow(
        {
            title: 'Vuelve a ingresar',
            text: 'Vuelve a elegir la opción "Gestionar cuenta" en el menú',
            button:
            {
                text: 'Aceptar',
                callback: function()
                {
                    location.href = 'index.html';
                }
            }
        });
        return;
    }
    
    //deleteCookie('_login');

    //Comprobar que tenemos una clave válida y obtener el nombre de usuario
    try
    {
        const usernameCall = await axios.get(`${path}/getUsername`, {headers: {key: theSecretThingThatNobodyHaveToKnow}});
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
                        location.href = 'index.html';
                    }    
                }
            });
            return;
        }
        else if(usernameCall.data.username === undefined)
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
                        location.href = 'index.html';
                    }    
                }
            });
            return;
        }

        username = usernameCall.data.username;
        email = usernameCall.data.email;
        passwordLength = usernameCall.data.passwordLength;
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
                    location.href = 'index.html';
                }
            }
        });
        return;
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
    if(actualMenu !== 'main') return;

    mainMenu.hidden = true;

    updateDataMenuPlaceholders();

    changeDataMenu.hidden = false;
    actualMenu = 'changeData';
    window.scrollTo(0,0);
});

document.getElementById('toChangeLanguageMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    mainMenu.hidden = true;
    changeLanguageMenu.hidden = false;
    actualMenu = 'changeLanguage';
    window.scrollTo(0,0);
});

document.getElementById('toLocalCopyMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;
    
    mainMenu.hidden = true;

    updateLocalCopyEnabledText();

    localCopyMenu.hidden = false;
    actualMenu = 'localCopy';
    window.scrollTo(0,0);
});

document.getElementById('logOutInAllMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    mainMenu.hidden = true;
    logOutInAllMenu.hidden = false;
    actualMenu = 'logOutInAll';
    window.scrollTo(0,0);
});

document.getElementById('deleteAccountMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    mainMenu.hidden = true;
    updateDeleteAccountPlaceholders();
    deleteAccountMenu.hidden = false;
    actualMenu = 'deleteAccount';
    window.scrollTo(0,0);
});

document.getElementById('goBackToNotes').addEventListener('click', function()
{
    mainScreen.hidden = true;
    loadingScreen.hidden = false;

    if(thingsChanged.lang !== undefined && thingsChanged.localCopy !== undefined)
    {
        location.href = `index.html#lang=${thingsChanged.lang};localcopy=${thingsChanged.localCopy}`;
    }
    else if(thingsChanged.lang !== undefined)
    {
        location.href = `index.html#lang=${thingsChanged.lang}`;
    }
    else if(thingsChanged.localCopy !== undefined)
    {
        location.href = `index.html#localcopy=${thingsChanged.localCopy}`;
    }
    else location.href = 'index.html';
});