document.getElementById('logOutInAllOkButton').addEventListener('click', async function()
{
    if(actualMenu !== 'logOutInAll') return;

    actualMenu = 'ventana';
    floatingWindow({title: getText('logginOut')});

    try
    {
        const response = await axios.post(`${path}/logoutalldevices`, {key: theSecretThingThatNobodyHaveToKnow});
        closeWindow(function()
        {
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
                            closeWindow();
                        }
                    }
                });
            }
        });
    }
    catch
    {
        //Server caído
        closeWindow(function()
        {
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
                        closeWindow();
                    }
                }
            });
        });
    }
});

document.getElementById('logOutInAllCancelButton').addEventListener('click', function()
{
    if(actualMenu !== 'logOutInAll') return;

    actualMenu = 'main';
    logOutInAllMenu.hidden = true;
    mainMenu.hidden = false;
    window.scrollTo(0,0);
});