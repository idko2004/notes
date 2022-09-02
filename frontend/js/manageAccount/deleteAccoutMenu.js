function updateDeleteAccountPlaceholders()
{
    document.getElementById('deleteAccountEmailSent').innerText = email;
    document.getElementById('deleteAccountButton').innerText = getText('deleteTheAccount',[username]);
}

document.getElementById('goBackDeleteAccountMenu').addEventListener('click', function()
{
    if(actualMenu !== 'deleteAccount' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        deleteAccountMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);
        deleteAccountMenu.removeEventListener('animationend', endAnimationCallback);
    }

    deleteAccountMenu.classList.remove('openMenu');
    deleteAccountMenu.classList.add('closeMenu');
    deleteAccountMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('deleteAccountButton').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteAccount' || isLocalMode) return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        deleteAccountMenu.hidden = true;
        deleteAccountEmailCodeMenu.hidden = false;

        deleteAccountEmailCodeMenu.classList.remove('closeMenu');
        deleteAccountEmailCodeMenu.classList.add('openMenu');

        actualMenu = 'deleteAccountEmailCode';
        window.scrollTo(0,0);
        deleteAccountMenu.removeEventListener('animationend', endAnimationCallback);
    }

    deleteAccountMenu.classList.remove('openMenu');
    deleteAccountMenu.classList.add('closeMenu');
    deleteAccountMenu.addEventListener('animationend', endAnimationCallback);

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
                        closeWindow(function()
                        {
                            let endAnimationCallback = function(e)
                            {
                                if(e.animationName !== 'closeMenuAnimation') return;
    
                                deleteAccountEmailCodeMenu.hidden = true;
                                deleteAccountMenu.hidden = false;
    
                                deleteAccountMenu.classList.remove('closeMenu');
                                deleteAccountMenu.classList.add('openMenu');
    
                                window.scrollTo(0,0);
                                actualMenu = 'deleteAccount';
                                deleteAccountEmailCodeMenu.removeEventListener('animationend', endAnimationCallback);
                            }
    
                            deleteAccountEmailCodeMenu.classList.remove('openMenu');
                            deleteAccountEmailCodeMenu.classList.add('closeMenu');
                            deleteAccountEmailCodeMenu.addEventListener('animationend', endAnimationCallback);
                        });
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
                    closeWindow(function()
                    {
                        let endAnimationCallback = function(e)
                        {
                            if(e.animationName !== 'closeMenuAnimation') return;

                            deleteAccountEmailCodeMenu.hidden = true;
                            deleteAccountMenu.hidden = false;

                            deleteAccountMenu.classList.remove('closeMenu');
                            deleteAccountMenu.classList.add('openMenu');

                            window.scrollTo(0,0);
                            actualMenu = 'deleteAccount';
                            deleteAccountEmailCodeMenu.removeEventListener('animationend', endAnimationCallback);
                        }

                        deleteAccountEmailCodeMenu.classList.remove('openMenu');
                        deleteAccountEmailCodeMenu.classList.add('closeMenu');
                        deleteAccountEmailCodeMenu.addEventListener('animationend', endAnimationCallback);
                    });
                }
            }
        });
    }
});

document.getElementById('confirmDeleteAccount').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteAccountEmailCode' || isLocalMode) return;

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

    //floatingWindow({title: getText('waitAMoment')});
    document.getElementById('confirmDeleteAccount').innerText = getText('waitAMoment');
    actualMenu = 'ventana';

    try
    {
        console.log(code);
        const response = await encryptHttpCall('/deleteAccount',
        {
            key: theSecretThingThatNobodyHaveToKnow,
            encrypt: {code}
        }, theOtherSecretThing);

        document.getElementById('confirmDeleteAccount').innerText = getText('verify');
        if(response.data.error !== undefined)
        {
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
                            document.getElementById('deleteAccountCodeInput').value = '';
                            closeWindow();
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
        actualMenu = 'ventana';
        document.getElementById('confirmDeleteAccount').innerText = getText('verify');
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

document.getElementById('deleteAccountCodeInput').addEventListener('keyup', function(e)
{
    if(e.key === 'Enter')
    {
        document.getElementById('confirmDeleteAccount').click();
    }
    else e.target.value = e.target.value.toUpperCase();
});
