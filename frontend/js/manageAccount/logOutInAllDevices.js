document.getElementById('logOutInAllMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main' || isLocalMode) return;

    actualMenu = 'logOutInAll';

    animatedTransition(mainMenu, logOutInAllMenu);
});

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

    actualMenu = 'main';
    animatedTransition(logOutInAllMenu, mainMenu);
});