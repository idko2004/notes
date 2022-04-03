const menuButton = document.getElementById('menuButton');
const menuTitleText = document.getElementById('menuTitleText');
const closeMenuButton = document.getElementById('closeMenuButton');
const menuExitLocalMode = document.getElementById('menuExitLocalMode');
const menuEraseAll = document.getElementById('menuEraseAll');
const menuOnlineManageAccount = document.getElementById('menuOnlineManageAccount');
const menuOnlineLogOut = document.getElementById('menuOnlineLogOut');
const menuOnlineChangeToLocal = document.getElementById('menuOnlineChangeToLocal');

async function menuButtonText()
{
    if(isLocalMode)
    {
        menuButton.innerText = 'Modo local';

        menuExitLocalMode.hidden = false;
        menuEraseAll.hidden = false;

        menuOnlineLogOut.hidden = true;
        menuOnlineManageAccount.hidden = true;
        menuOnlineChangeToLocal.hidden = true;
    }
    else
    {
        menuButton.innerText = 'Cuenta de alguien';

        menuExitLocalMode.hidden = true;
        menuEraseAll.hidden = true;

        menuOnlineLogOut.hidden = false;
        menuOnlineManageAccount.hidden = false;
        menuOnlineChangeToLocal.hidden = false;

        //Obtener nombre de usuario
        const response = await axios.get(`${path}/getUsername`, {headers: {key: theSecretThingThatNobodyHasToKnow}});
        menuButton.innerText = response.data.username;
        menuTitleText.innerText = response.data.username;
    }
}

//Botón de cerrar sesión
menuOnlineLogOut.addEventListener('click', async function()
{
    deleteKey('_login');

    floatingMenu.hidden = true;
    floatingWindow(
    {
        title: 'Cerrando sesión...'
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

menuOnlineChangeToLocal.addEventListener('click', function()
{
    location.hash = '#local'
    location.reload();
});

//Botón de gestionar cuenta
menuOnlineManageAccount.addEventListener('click', async function()
{
    document.getElementById('noteScreen').hidden = true;
    floatingMenu.hidden = true;
    loadingScreen.hidden = false;

    await saveNote();
    saveCookie('_login', theSecretThingThatNobodyHasToKnow);
    location.href = 'manageAccount.html';
});

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

menuExitLocalMode.addEventListener('click', function()
{
    if(location.hash === '#local')
    {
        location.hash = '';
        location.reload();
        return;
    }

    saveNote();
    document.getElementById('noteScreen').hidden = true;
    notesList.innerHTML = '';
    noteName.innerText = 'Haz click sobre una nota.'
    textArea.value = '';
    textArea.disabled = true;

    document.getElementById('loginScreen').hidden = false;
    floatingMenu.hidden = true;

    theSecretThingThatNobodyHasToKnow = undefined;
    deleteKey('_login');

    canInteract = true;
});

menuEraseAll.addEventListener('click', function()
{
    floatingMenu.hidden = true;
    if(theSecretThingThatNobodyHasToKnow === 'local') floatingWindow(
    {
        title: '¿Borrar todos los datos locales?',
        text: 'Se borrarán todos los datos que se hayan guardado en este navegador en el modo local',
        buttons:
        [
            {
                text: 'No borrar nada',
                primary: false,
                callback: () => {closeWindow()}
            },
            {
                text: 'Borrar',
                primary: true,
                callback: () =>
                {
                    closeWindow();
                    floatingWindow(
                    {
                        title: '¿De verdad vas a borrarlo todo?',
                        buttons:
                        [
                            {
                                text: '¡De verdad voy a borrarlo todo!',
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
                                text: 'No voy a borrar nada',
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