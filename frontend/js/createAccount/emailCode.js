function updateWeSentAnEmail()
{
    document.getElementById('changeDataEmailSent').innerText = account.email;
}

document.getElementById('changeDataCancelCodeButton').addEventListener('click', function()
{
    if(actualMenu !== 'email') return;
    emailCodeGoBackAnimation();
});

function emailCodeGoBackAnimation()
{
    usernameField.value = '';
    emailField.value = '';
    passwordField.value = '';
    comprobePasswordField.value = '';
    updateUsernamePlaceholder();

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        emailCodeMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);

        emailCodeMenu.removeEventListener('animationend', endAnimationCallback);
    }

    emailCodeMenu.classList.remove('openMenu');
    emailCodeMenu.classList.add('closeMenu');

    emailCodeMenu.addEventListener('animationend', endAnimationCallback);
}

//Solicitar el email
async function sendEmail()
{
    let a = [null, undefined, ''];
    for(let i = 0; i < a.length; i++)
    {
        if([account.email, account.username, account.password].includes(a[i]))
        {
            actualMenu = 'ventana';
            console.log('datos inválidos');
            floatingWindow(
            {
                title: 'Datos no válidos',
                text: 'Alguno de los datos usados para crear la cuenta no son válidos.',
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            location.reload();
                        })
                    }
                }
            });
            return;
        }
    }

    try
    {
        const response = await encryptHttpCall('/createAccountEmailCode',
        {
            id: deviceID,
            encrypt:
            {
                email: account.email,
                username: account.username,
                operation: 'newAccount',
                password: account.password
            }
        }, idPassword);
        
        console.log(response);

        if(response.data.error === 'invalidFields')
        {
            actualMenu = 'ventana';
            floatingMenu(
            {
                title: getText('somethingWentWrong'),
                text: getText('oneFieldInvalid'),
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        closeWindow(emailCodeGoBackAnimation);
                    }
                }
            });
        }
        else if(response.data.error === 'duplicatedEmail')
        {
            actualMenu = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWront'),
                text: getText('emailDuplicated'),
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        closeWindow(emailCodeGoBackAnimation);
                    }
                }
            });
        }
        else if(response.data.error !== undefined)
        {
            actualMenu = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('errorCode')}: ${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        closeWindow(emailCodeGoBackAnimation);
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
                    closeWindow(emailCodeGoBackAnimation);
                }
            }
        })
    }
}

const emailCodeField = document.getElementById('changeDataConfirmCode');
const comprobeEmailCodeButton = document.getElementById('changeDataConfirmCodeButton');

emailCodeField.addEventListener('keyup', function(e)
{
    if(e.key === 'Return' || e.key === 'Enter') comprobeEmailCodeButton.click();
    else e.target.value = e.target.value.toUpperCase();
})

//Comprobar si el código es correcto
comprobeEmailCodeButton.addEventListener('click', async function()
{
    if(actualMenu !== 'email') return;
    const code = emailCodeField.value?.trim();
    if([undefined, null, ''].includes(code)) return;

    comprobeEmailCodeButton.innerText = getText('waitAMoment');
    actualMenu = 'loading';

    try
    {
        const response = await encryptHttpCall('/createNewAccount',
        {
            id: deviceID,
            encrypt:
            {
                code
            }
        }, idPassword);

        console.log(response);

        if(response.data.error === 'invalidCode')
        {
            actualMenu = 'ventana';
            floatingWindow(
            {
                title: getText('introduceAValidCode'),
                text: getText('introduceAValidCode2'),
                button:
                {
                    text: 'ok',
                    callback: function()
                    {
                        actualMenu = 'email';
                        closeWindow();
                    }
                }
            })
        }
        else if(response.data.error !== undefined)
        {
            actualMenu = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('errorCode')}: ${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        actualMenu = 'email';
                        closeWindow();
                    }
                }
            });
        }
        else
        {
            //Cuenta creada
            actualMenu = 'ventana';
            deleteCookie('_id');
            deleteCookie('_idPswrd');
            floatingWindow(
            {
                title: getText('accountCreated'),
                text: getText('accountCreated2'),
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        closeWindow(function()
                        {
                            location.href = 'index.html';
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
                    actualMenu = 'email';
                    closeWindow();
                }
            }
        })
    }

    comprobeEmailCodeButton.innerText = getText('verify');
});