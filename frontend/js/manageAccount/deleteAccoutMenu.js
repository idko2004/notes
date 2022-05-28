function updateDeleteAccountPlaceholders()
{
    document.getElementById('deleteAccountEmailSent').innerText = email;
    document.getElementById('deleteAccountButton').innerText = getText('deleteTheAccount',[username]);
}

document.getElementById('goBackDeleteAccountMenu').addEventListener('click', function()
{
    if(actualMenu !== 'deleteAccount') return;

    deleteAccountMenu.hidden = true;
    mainMenu.hidden = false;
    actualMenu = 'main';
    window.scrollTo(0,0);
});

document.getElementById('deleteAccountButton').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteAccount') return;

    deleteAccountMenu.hidden = true;
    deleteAccountEmailCodeMenu.hidden = false;
    actualMenu = 'deleteAccountEmailCode';
    window.scrollTo(0,0);

    try
    {
        const response = await axios.post(`${path}/deleteAccountCode`, {key: theSecretThingThatNobodyHaveToKnow});
        console.log(response);

        if(response.data.error !== undefined)
        {
            actualMenu = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('errorCode')}: ${response.data.error},`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        deleteAccountEmailCodeMenu.hidden = true;
                        deleteAccountMenu.hidden = false;
                        window.scrollTo(0,0);
                        actualMenu = 'deleteAccount';
                        closeWindow();
                    }
                }
            });
        }
    }
    catch
    {
        actualMenu = 'ventana';
        floatingWindow(
        {
            title: getText('ups'),
            text: getText('serverDown'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    deleteAccountEmailCodeMenu.hidden = true;
                    deleteAccountMenu.hidden = false;
                    window.scrollTo(0,0);
                    actualMenu = 'deleteAccount';
                    closeWindow();
                }
            }
        });
    }
});

document.getElementById('confirmDeleteAccount').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteAccountEmailCode') return;

    let code = document.getElementById('deleteAccountCodeInput').value.trim().toUpperCase();
    console.log(code);
    if(code === undefined || code === '' || code.length !== 5)
    {
        actualMenu = 'ventana';
        floatingWindow(
        {
            title: getText('introduceAValidCode'),
            text: getText('introduceAValidCode2'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    actualMenu = 'deleteAccountEmailCode';
                    closeWindow();
                }
            }
        });
        return;
    }

    floatingWindow({title: getText('waitAMoment')});
    actualMenu = 'ventana';

    try
    {
        console.log(code);
        const response = await axios.post(`${path}/deleteAccount`, {code, key: theSecretThingThatNobodyHaveToKnow});

        if(response.data.error !== undefined)
        {
            closeWindow();
            if(response.data.error === 'invalidCode')
            {
                floatingWindow(
                {
                    title: getText('introduceAValidCode'),
                    text: getText('introduceAValidCode2'),
                    button:
                    {
                        text: getText('ok'),
                        callback: function()
                        {

                            actualMenu = 'deleteAccountEmailCode';
                            closeWindow();
                            document.getElementById('deleteAccountCodeInput').value = '';
                        }
                    }
                });
                return;
            }
            else
            {
                floatingWindow(
                {
                    title: getText('somethingWentWrong'),
                    text: `${getText('errorCode')}: ${response.data.error}`,
                    button:
                    {
                        text: getText('ok'),
                        callback: function()
                        {
                            actualMenu = 'deleteAccountEmailCode';
                            closeWindow();
                        }
                    }
                });
                return;
            }
        }
        else if(response.data.accountDeleted)
        {
            //Todo salió bien
            closeWindow();
            console.log('Cuenta eliminada');
            floatingWindow(
            {
                title: getText('accountDeleted'),
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        location.href = 'index.html#logout';
                    }
                }
            });
        }
    }
    catch
    {
        closeWindow();
        actualMenu = 'ventana';
        floatingWindow(
        {
            title: getText('ups'),
            text: getText('serverDown'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    actualMenu = 'deleteAccountEmailCode';
                    closeWindow();
                }
            }
        });
    }
});