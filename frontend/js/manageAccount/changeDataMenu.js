const changeUsernameField = document.getElementById('changeUsernameField');
const changeEmailField = document.getElementById('changeEmailField');
const changePasswordField = document.getElementById('changePasswordField');
const comprobePasswordField = document.getElementById('comprobePasswordField');

function updateDataMenuPlaceholders()
{
    changeUsernameField.placeholder = username;
    changeEmailField.placeholder = email;
    let pswrd = '';
    for(let i = 0; i < passwordLength; i++) pswrd += '*';
    changePasswordField.placeholder = pswrd;
    comprobePasswordField.placeholder = getText('confirmPassword');
}

document.getElementById('goBackChangeDataMenu').addEventListener('click', function()
{
    if(actualMenu !== 'changeData') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        changeDataMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');
    
        actualMenu = 'main';
        window.scrollTo(0,0);

        changeUsernameField.value = '';
        changeEmailField.value = '';
        changePasswordField.value = '';
        comprobePasswordField.value = '';

        changeDataMenu.removeEventListener('animationend', endAnimationCallback);
    }
    
    changeDataMenu.classList.remove('openMenu');
    changeDataMenu.classList.add('closeMenu');

    changeDataMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('saveChangeDataMenu').addEventListener('click', function()
{
    if(actualMenu !== 'changeData') return;

    let somethingChanged = false;

    let newUsername = changeUsernameField.value;
    let newEmail = changeEmailField.value;
    let newPassword = changePasswordField.value;
    let newPasswordLength = newPassword.length;
    let comprobePassword = comprobePasswordField.value;

    //Comprobar el nuevo nombre de usuario

        //no esté vacío
    if(newUsername === '') newUsername = username;
    else
    {
        //no tenga más de 30 caracteres
        if(newUsername.length > 30)
        {
            floatingWindow(
            {
                title: getText('username'),
                text: getText('usernameTooLong'),
                button:
                {
                    text: getText('ok'),
                    callback: closeWindow
                }
            });
            return;
        }
        somethingChanged = true;
    }

    //Comprobar el nuevo correo electrónico
    if(newEmail === '') newEmail = email;
    else
    {
        const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(!regex.test(newEmail))
        {
            floatingWindow(
            {
                title: getText('email'),
                text: getText('invalidEmail'),
                button:
                {
                    text: getText('ok'),
                    callback: closeWindow
                }
            });
            return;
        }
        somethingChanged = true;
    }

    //Comprobar las nuevas contraseñas
    if(newPassword === '') newPasswordLength = passwordLength;
    else
    {
        newPasswordLength = newPassword.length;

        //Comprobar si la contraseña es lo suficientemente larga
        if(newPasswordLength < 8)
        {
            floatingWindow(
            {
                title: getText('password'),
                text: getText('tooShortPassword'),
                button:
                {
                    text: getText('ok'),
                    callback: closeWindow
                }
            });
            return;
        }

        if(newPasswordLength > 20)
        {
            floatingWindow(
            {
                title: getText('password'),
                text: getText('tooLongPassword'),
                button:
                {
                    text: getText('ok'),
                    callback: closeWindow
                }
            });
            return;
        }

        //Comprobar si la contraseña tiene los caracteres adecuados
        const capitalsRegex = new RegExp('[A-Z]+');
        const notCapitalsRegex = new RegExp('[a-z]+');
        const numbersRegex = new RegExp('[0-9]+');
    
        const containsCapitals = capitalsRegex.test(newPassword);
        const containsNotCapitals = notCapitalsRegex.test(newPassword);
        const containsNumbers = numbersRegex.test(newPassword);

        if(!containsCapitals || !containsNotCapitals || !containsNumbers)
        {
            floatingWindow(
            {
                title: getText('password'),
                text: getText('passwordMustContains'),
                button:
                {
                    text: getText('ok'),
                    callback: closeWindow
                }
            });
            return;
        }
        
        //Comprobar si las contraseñas coinciden
        if(newPassword !== comprobePassword)
        {
            floatingWindow(
            {
                title: getText('password'),
                text: getText('passwordsDontMatch'),
                button:
                {
                    text: getText('ok'),
                    callback: closeWindow
                }
            });
            return;
        }

        somethingChanged = true;
    }

    if(!somethingChanged)
    {
        floatingWindow(
        {
            title: getText('nothingChange'),
            text: getText('nothingChange2'),
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });
        return;
    }

    //Mostrar los datos finales
    let pswrd = '';
    for(let i = 0; i < newPasswordLength; i++) pswrd += '*';

    floatingWindow(
    {
        title: getText('itIsOk'),
        text: `${getText('username')}:\n${newUsername}\n\n${getText('email')}:\n${newEmail}\n\n${getText('password')}:\n${pswrd}`,
        buttons:
        [
            {
                text: getText('cancelButWithNo'),
                primary: false,
                callback: closeWindow
            },
            {
                text: getText('yesSaveTheseChanges'),
                primary: true,
                callback: async function()
                {
                    closeWindow(async function()
                    {
                        let endAnimationCallback = function(e)
                        {
                            if(e.animationName !== 'closeMenuAnimation') return;

                            changeDataMenu.hidden = true;
                            changeDataEmailCodeMenu.hidden = false;

                            changeDataEmailCodeMenu.classList.remove('closeMenu');
                            changeDataEmailCodeMenu.classList.add('openMenu');

                            actualMenu = 'changeDataEmailCode';

                            changeDataMenu.removeEventListener('animationend', endAnimationCallback);
                        }
                        document.getElementById('changeDataEmailSent').innerText = email;

                        changeDataMenu.classList.remove('openMenu');
                        changeDataMenu.classList.add('closeMenu');
                    
                        changeDataMenu.addEventListener('animationend', endAnimationCallback);
    
                        //Hacer la llamada al servidor para actualizar a los nuevos datos, generar un código y enviar el email
                        try
                        {
                            const response = await axios.post(`${path}/createAccountEmailCode`,{email: newEmail, password: newPassword, username: newUsername, operation: 'updateAccount', oldemail: email});
                            console.log(response);
    
                            if(!response.data.emailSent && response.data.error !== undefined)
                            {
                                console.log(response.data.error);
                                if(response.data.error === 'invalidFields')
                                {
                                    //Ventana que te haga volver atrás y que diga que los datos no son válidos
                                    actualMenu = 'ventana';
                                    floatingWindow(
                                    {
                                        title: getText('somethingWentWrong'),
                                        text: getText('oneFieldInvalid'),
                                        button:
                                        {
                                            text: getText('back'),
                                            callback: function()
                                            {
                                                closeWindow(changeDataEmailCodeMenuGoBackAnimation);
                                            }
                                        }
                                    });
                                }
                                else if(response.data.error === 'duplicatedEmail')
                                {
                                    //Ventana que te haga volver atrás y que diga que ese email ya existe
                                    actualMenu = 'ventana';
                                    floatingWindow(
                                    {
                                        title: getText('somethingWentWrong'),
                                        text: getText('emailDuplicated'),
                                        button:
                                        {
                                            text: getText('back'),
                                            callback: function()
                                            {
                                                closeWindow(changeDataEmailCodeMenuGoBackAnimation);
                                            }
                                        }
                                    });
                                }
                                else
                                {
                                    //Ventana que te haga volver atrás y que muestre response.data.error
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
                                                closeWindow(changeDataEmailCodeMenuGoBackAnimation);
                                            }
                                        }
                                    });
                                }
        
                            }
                        }
                        catch
                        {
                            //Ventana que diga que se cayó el servidor
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
                                        closeWindow(changeDataEmailCodeMenuGoBackAnimation);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        ]
    });
});

function changeDataEmailCodeMenuGoBackAnimation()
{
    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        changeDataEmailCodeMenu.hidden = true;
        changeDataMenu.hidden = false;

        changeDataMenu.classList.remove('closeMenu');
        changeDataMenu.classList.add('openMenu');

        actualMenu = 'changeData';

        changeDataEmailCodeMenu.removeEventListener('animationend', endAnimationCallback);
    }

    changeDataEmailCodeMenu.classList.remove('openMenu');
    changeDataEmailCodeMenu.classList.add('closeMenu');

    changeDataEmailCodeMenu.addEventListener('animationend', endAnimationCallback);
}

//Botón de comprobar código
document.getElementById('changeDataConfirmCodeButton').addEventListener('click', changeDataComprobeCode);

const changeDataConfirmCodeField = document.getElementById('changeDataConfirmCode');
changeDataConfirmCodeField.addEventListener('keyup', function(e)
{
    if(e.key === 'Enter') changeDataComprobeCode();
    e.target.value = e.target.value.toUpperCase();
});

async function changeDataComprobeCode()
{
    if(actualMenu !== 'changeDataEmailCode') return;

    const code = changeDataConfirmCodeField.value;

    if(code.length !== 5)
    {
        floatingWindow(
        {
            title: getText('introduceAValidCode'),
            text: getText('introduceAValidCode2'),
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });
        return;
    }

    actualMenu = 'changeDataComprobingCode';
    floatingWindow({title: getText('waitAMoment')});

    try
    {
        const response = await axios.post(`${path}/updateAccountData`,{code, key:theSecretThingThatNobodyHaveToKnow});
        console.log(response);
        closeWindow(function()
        {
            if(response.data.updated)
            {
                //Que todo salió bien
                floatingWindow(
                {
                    title: getText('accountUpdated'),
                    button:
                    {
                        text: getText('backToHome'),
                        callback: function()
                        {
                            closeWindow(function()
                            {
                                mainScreen.hidden = true;
                                loadingScreen.hidden = false;
                                saveCookie('_login', theSecretThingThatNobodyHaveToKnow);

                                changeUsernameField.value = '';
                                changeEmailField.value = '';
                                changePasswordField.value = '';
                                comprobePasswordField.value = '';
                                location.reload();
                            });
                        }
                    }
                });
                changeDataConfirmCodeField.value = '';
            }
            else if(response.data.hadToInsertOtherCode)
            {
                //Que se ha cambiado el email y hay que comprobar el nuevo.
                floatingWindow(
                {
                    title: getText('oneLastStep'),
                    text: getText('confirmEmailAgain'),
                    button:
                    {
                        text: getText('ok'),
                        callback: function()
                        {
                            actualMenu = 'changeDataEmailCode';
                            closeWindow();
                        }
                    }
                });
                document.getElementById('changeDataEmailSent').innerText = response.data.email;
                changeDataConfirmCodeField.value = '';
            }
            else if(response.data.error === 'invalidCode')
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
                            actualMenu = 'changeDataEmailCode';
                            closeWindow();
                        }
                    }
                });
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
                            closeWindow(changeDataEmailCodeMenuGoBackAnimation);
                        }
                    }
                });
                changeDataConfirmCodeField.value = '';
            }    
        });
    }
    catch
    {
        //Ventana que diga que se cayó el servidor
        actualMenu = 'ventana';
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
                        closeWindow();
                        actualMenu = 'changeDataEmailCode';
                    }
                }
            });
        });
        changeDataConfirmCodeField.value = '';
    }
}

//Que cuando le des a enter cambie al siguiente campo
changeUsernameField.addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') changeEmailField.focus();
});

changeEmailField.addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') changePasswordField.focus();
});

changePasswordField.addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') comprobePasswordField.focus();
});

comprobePasswordField.addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') document.getElementById('saveChangeDataMenu').click();
});