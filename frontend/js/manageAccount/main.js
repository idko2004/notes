const path = 'http://localhost:8888';

let email;
let theSecretThingThatNobodyHasToKnow;
let deviceID;
let saveNotesLocally;
let spellcheckConfig;
const thingsChanged =
{
    lang: undefined,
    localCopy: undefined,
    colorTheme: undefined,
    spellcheck: undefined
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
//  deleteConfiguration
//  deleteAllLocal
//  spellcheck
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
const deleteConfigurationMenu = document.getElementById('deleteConfigurationMenu');
const deleteAllMenu = document.getElementById('deleteAllMenu');
const spellcheckMenu = document.getElementById('spellcheckMenu');

const emailSpace = document.getElementById('emailSpace');
const usernameSpace = document.getElementById('usernameSpace');
const passwordSpace = document.getElementById('passwordSpace');

start();

async function start()
{
    theSecretThingThatNobodyHaveToKnow = getSpecificCookie('_login');
    theOtherSecretThing = getSpecificCookie('_pswrd');
    deviceID = getSpecificCookie('_id');
    saveNotesLocally = getSpecificCookie('_localCopy');
    spellcheckConfig = getSpecificCookie('_spellcheck');

    //Cargar el modo local
    if(theSecretThingThatNobodyHaveToKnow === 'local')
    {
        isLocalMode = true;
        mainMenu.hidden = false;
        loadingScreen.hidden = true;
        mainScreen.hidden = false;
        actualMenu = 'main';
        changeHashMenu('main');

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

        console.log('theSecretThingThatNobodyHaveToKnow', theSecretThingThatNobodyHaveToKnow);
        console.log('saveNotesLocally', saveNotesLocally);
        console.log('theOtherSecretThing', theOtherSecretThing);

        if([theSecretThingThatNobodyHaveToKnow, saveNotesLocally, theOtherSecretThing, deviceID].includes(null)
        || [theSecretThingThatNobodyHaveToKnow, saveNotesLocally, theOtherSecretThing, deviceID].includes(undefined)
        || [theSecretThingThatNobodyHaveToKnow, saveNotesLocally, theOtherSecretThing, deviceID].includes(''))
        {
            loadingScreen.hidden = true;
            floatingWindow(
            {
                title: getText('reenter'),
                text: getText('reenter_manageAccount'),
                button:
                {
                    text: getText('ok'),
                    callback: async function()
                    {
                        await closeWindow();
                        location.href = 'index.html';
                    }
                }
            });
            return;
        }

        if(!await updateUserData())
        {
            loadingScreen.hidden = true;
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: getText('reenter_manageAccount'),
                button:
                {
                    text: getText('ok'),
                    callback: async function()
                    {
                        await closeWindow();
                        location.href = 'index.html';
                    }
                }
            });
            return;
        }
        mainMenu.hidden = false;
        loadingScreen.hidden = true;
        mainScreen.hidden = false;
        actualMenu = 'main';
        changeHashMenu('main');
    }
}

async function updateUserData()
{
    try
    {
        const response = await encryptHttpCall('/getUserEmail',
        {
            deviceID,
            encrypt:
            {
                key: theSecretThingThatNobodyHaveToKnow
            }
        }, theOtherSecretThing);

        if(response.data.decrypt.email !== undefined)
        {
            email = response.data.decrypt.email;
            emailSpace.innerText = email;
            return true;
        }
        else
        {
            console.log('No se obtuvo el email', response.data.error);
            return false;
        }
    }
    catch(err)
    {
        console.log('Catch updateUserData', err);
        return false;
    }
}

async function animatedTransition(elementToHide, elementToShow, callback)
{
    return new Promise(function(resolve, reject)
    {
        let endAnimationCallback = function(e)
        {
            if (e.animationName !== 'closeMenuAnimation') return;
    
            elementToHide.hidden = true;
    
            if(callback !== undefined && typeof callback === 'function') callback();
            resolve();
    
            if(elementToShow !== undefined)
            {
                elementToShow.classList.remove('closeMenu');
                elementToShow.classList.add('openMenu');
                elementToShow.hidden = false;
            }
    
            window.scrollTo(0, 0);
            elementToHide.removeEventListener('animationend', endAnimationCallback);
        }
    
        elementToHide.classList.remove('openMenu');
        elementToHide.classList.add('closeMenu');
    
        elementToHide.addEventListener('animationend', endAnimationCallback);
    });
}

function getElementByMenuName(menuName)
{
    let menuList =
    {
        main: mainMenu,
        changeData: changeDataMenu,
        changeDataEmailCode: changeDataEmailCodeMenu,
        changeDataComprobingCode: changeDataEmailCodeMenu,
        changeLanguage: changeLanguageMenu,
        logOutInAll: logOutInAllMenu,
        deleteAccount: deleteAccountMenu,
        deleteAccountEmailCode: deleteAccountEmailCodeMenu,
        localCopy: localCopyMenu,
        colorTheme: colorThemeMenu,
        deleteConfiguration: deleteConfigurationMenu,
        deleteAllLocal: deleteAllMenu,
        spellcheck: spellcheckMenu,
        ventana: undefined
    }

    return menuList[menuName];
}

document.getElementById('goBackToNotes').addEventListener('click', backToIndex);

async function backToIndex()
{
    if(actualMenu !== 'main') return;
    actualMenu = 'ventana';

    await animatedTransition(mainMenu);

    mainScreen.hidden = true;
    loadingScreen.hidden = false;

    deleteAllCookies();

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
    if(thingsChanged.spellcheck !== undefined)
    {
        str +=`spellcheck=${thingsChanged.spellcheck};`;
    }

    str = str.slice(0, -1);
    location.href = str;
}