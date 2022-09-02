document.getElementById('logOutInAllOkButton').addEventListener('click', async function(e)
{
    if(actualMenu !== 'logOutInAll' || isLocalMode) return;

    actualMenu = 'ventana';
    e.target.innerText = getText('logginOut');

    try
    {
        const response = await axios.post(`${path}/logoutalldevices`, {key: theSecretThingThatNobodyHaveToKnow});
        if(response.data.ok && response.data.error === undefined)
        {
            //Ha salido bien
            location.href = 'index.html#logout'
        }
        else
        {
            //floating window con error code
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('errorCode')}:${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        actualMenu = 'logOutInAll';
                        e.target.innerText = getText('logOutInAll');
                        closeWindow();
                    }
                }
            });
        }
    }
    catch
    {
        //Server caído
        floatingWindow(
        {
            title: getText('ups'),
            text: getText('serverDown'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    actualMenu = 'logOutInAll';
                    e.target.innerText = getText('logOutInAll');
                    closeWindow();
                }
            }
        });
    }
});

document.getElementById('logOutInAllCancelButton').addEventListener('click', function()
{
    if(actualMenu !== 'logOutInAll' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        logOutInAllMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);
        logOutInAllMenu.removeEventListener('animationend', endAnimationCallback);
    }

    logOutInAllMenu.classList.remove('openMenu');
    logOutInAllMenu.classList.add('closeMenu');
    logOutInAllMenu.addEventListener('animationend', endAnimationCallback);
});