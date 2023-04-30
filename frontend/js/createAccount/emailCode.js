function updateWeSentAnEmail()
{
    document.getElementById('changeDataEmailSent').innerText = email;
}

document.getElementById('changeDataCancelCodeButton').addEventListener('click', function()
{
    if(actualMenu !== 'email') return;
    emailCodeGoBackAnimation();
});

function emailCodeGoBackAnimation()
{
    emailField.value = '';

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
    if([null, undefined, ''].includes(email))
    {
        actualMenu = 'ventana';
        console.log('datos inválidos');
        floatingWindow(
        {
            title: ':(',
            text: getText('oneFieldInvalid'),
            button:
            {
                text: getText('ok'),
                callback: async function()
                {
                    await closeWindow();
                    location.reload();
                }
            }
        });
        return;
    }

    try
    {
        console.log('http: solicitando código por email');
        const response = await encryptHttpCall('/newAccount',
        {
            deviceID,
            encrypt:
            {
                email,
                lang: actualLanguage
            }
        }, theOtherSecretThing);
        
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
                    callback: async function()
                    {
                        await closeWindow();
                        emailCodeGoBackAnimation();
                    }
                }
            });
        }
        else if(response.data.error === 'duplicatedEmail')
        {
            actualMenu = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: getText('emailDuplicated'),
                button:
                {
                    text: getText('ok'),
                    callback: async function()
                    {
                        await closeWindow();
                        emailCodeGoBackAnimation();
                    }
                }
            });
        }
        else if(response.data.error === 'duplicatedUsername')
        {
            actualMenu = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: getText('usernameDuplicated'),
                button:
                {
                    text: getText('ok'),
                    callback: async function()
                    {
                        await closeWindow();
                        emailCodeGoBackAnimation();
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
                    callback: async function()
                    {
                        await closeWindow();
                        emailCodeGoBackAnimation();
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
                callback: async function()
                {
                    await closeWindow();
                    emailCodeGoBackAnimation();
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
        console.log('http: comprobando si el código es correcto');
        const response = await encryptHttpCall('/newAccountCode',
        {
            deviceID,
            encrypt:
            {
                emailCode: code,
                email
            }
        }, theOtherSecretThing);

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
                    text: getText('ok'),
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
            deleteAllCookies();
            floatingWindow(
            {
                title: getText('accountCreated'),
                text: getText('accountCreated2'),
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