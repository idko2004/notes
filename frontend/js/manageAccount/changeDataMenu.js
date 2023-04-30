document.getElementById('toChangeDataMenuButton').addEventListener('click', function()
{
    if(actualMenu !== 'main' || isLocalMode) return;

    actualMenu = 'changeData';
    changeHashMenu('changeData');

    updateDataMenuPlaceholders();

    animatedTransition(mainMenu, changeDataMenu);
});

let newEmail;

const changeEmailField = document.getElementById('changeEmailField');

function updateDataMenuPlaceholders()
{
    changeEmailField.placeholder = email;
}

document.getElementById('goBackChangeDataMenu').addEventListener('click', async function()
{
    if(actualMenu !== 'changeData' || isLocalMode) return;

    actualMenu = 'main';
    changeHashMenu('main');

    await animatedTransition(changeDataMenu, mainMenu);

    changeEmailField.value = '';
});

const saveChangeDataButton =  document.getElementById('saveChangeDataMenu');

saveChangeDataButton.addEventListener('click', async function()
{
    if(actualMenu !== 'changeData' || isLocalMode) return;
    
    actualMenu = 'ventana';

    let emailFieldValue = changeEmailField.value.trim();

    //Comprobar el nuevo correo electrónico
    if(emailFieldValue === '')
    {
        floatingWindow(
        {
            title: getText('nothingChange'),
            text: getText('nothingChange2'),
            button:
            {
                text: getText('ok'),
                callback: async function()
                {
                    await closeWindow();
                    actualMenu = 'changeData';
                }
            }
        });
        return;
    }

    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if(!regex.test(emailFieldValue))
    {
        floatingWindow(
        {
            title: getText('email'),
            text: getText('invalidEmail'),
            button:
            {
                text: getText('ok'),
                callback: async function()
                {
                    await closeWindow();
                    actualMenu = 'changeData';
                }
            }
        });
        return;
    }

    floatingWindow(
    {
        title: getText('itIsOk'),
        text: `${getText('email')}:\n${emailFieldValue}`,
        buttons:
        [
            {
                text: getText('cancelButWithNo'),
                primary: false,
                callback: async function()
                {
                    await closeWindow();
                    actualMenu = 'changeData';
                }
            },
            {
                text: getText('yesSaveTheseChanges'),
                primary: true,
                callback: async function()
                {
                    await closeWindow();

                    if(isLocalMode) return;

                    actualMenu = 'changeDataEmailCode';
                    changeHashMenu('changeDataEmailCode');
                    //document.getElementById('changeDataEmailSent').innerText = email;

                    newEmail = emailFieldValue;
                    updateEmailsCodesPlaceholders();

                    animatedTransition(changeDataMenu, changeDataEmailCodeMenu);

                    //Hacer la llamada al servidor para actualizar a los nuevos datos, generar un código y enviar el email
                    try
                    {
                        const response = await encryptHttpCall('/changeEmail',
                        {
                            deviceID,
                            encrypt:
                            {
                                key: theSecretThingThatNobodyHaveToKnow,
                                newEmail: emailFieldValue,
                                lang: actualLanguage
                            }
                        }, theOtherSecretThing);
                        console.log(response);

                        if(response.data.error === 'invalidEmail')
                        {
                            // El email no es válido
                            actualMenu = 'ventana';
                            floatingWindow(
                            {
                                title: getText('email'),
                                text: getText('invalidEmail'),
                                button:
                                {
                                    text: getText('ok'),
                                    callback: async function()
                                    {
                                        await closeWindow();
                                        animatedTransition(changeDataEmailCodeMenu, changeDataMenu);
                                        actualMenu = 'changeData';
                                    }
                                }
                            });
                            return;
                        }
                        else if(response.data.error === 'duplicatedEmail')
                        {
                            // El email ya existe
                            actualMenu = 'ventana';
                            floatingWindow(
                            {
                                title: getText('email'),
                                text: getText('emailDuplicated'),
                                button:
                                {
                                    text: getText('ok'),
                                    callback: async function()
                                    {
                                        await closeWindow();
                                        changeDataEmailCodeMenuGoBackAnimation();
                                    }
                                }
                            });
                            return;
                        }
                        else if(response.data.error !== undefined)
                        {
                            // Otro tipo de error
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
                                        changeDataEmailCodeMenuGoBackAnimation();
                                    }
                                }
                            });
                            return;
                        }
                        else if(response.data.emailSent)
                        {
                            // Todo salió bien
                            console.log('El servidor confirma que el email ha sido enviado');
                        }
                        else
                        {
                            // Error desconocido
                            console.log('NO SÉ QUE PASÓ AAAAAAAAAAAA');
                            floatingWindow(
                            {
                                title: getText('somethingWentWrong'),
                                text: getText('noErrorCode'),
                                button:
                                {
                                    text: getText('ok'),
                                    callback: async function()
                                    {
                                        await closeWindow();
                                        changeDataEmailCodeMenuGoBackAnimation();
                                    }
                                }
                            });
                            return;
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
                                callback: async function()
                                {
                                    await closeWindow();
                                    changeDataEmailCodeMenuGoBackAnimation();
                                }
                            }
                        });
                    }
                }
            }
        ]
    });
});

function changeDataEmailCodeMenuGoBackAnimation()
{
    actualMenu = 'changeData';
    changeHashMenu('changeData');
    animatedTransition(changeDataEmailCodeMenu, changeDataMenu);
}

async function changeDataComprobeCode()
{
    if(actualMenu !== 'changeDataEmailCode' || isLocalMode) return;

    const code1 = document.getElementById('changeDataConfirmCode').value.trim();
    const code2 = document.getElementById('changeDataConfirmCode2').value.trim();

    if(code1.length !== 5 || code2.length !== 5)
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

    if(newEmail === undefined || newEmail.trim() === '')
    {
        floatingWindow(
        {
            title: getText('somethingWentWrong'),
            text: `${getText('errorCode')}: frontendNoNewEmail`,
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });
        return;
    }

    actualMenu = 'changeDataComprobingCode';
    document.getElementById('changeDataConfirmCodeButton').innerText = getText('waitAMoment');

    try
    {
        const response = await encryptHttpCall('/changeEmailCode',
        {
            deviceID,
            encrypt:
            {
                key: theSecretThingThatNobodyHaveToKnow,
                newEmail,
                codeOld: code1,
                codeNew: code2
            }
        }, theOtherSecretThing);
        console.log(response);

        if(response.data.error === 'invalidCode')
        {
            // Uno de los códigos no es válido
            floatingWindow(
            {
                title: getText('introduceAValidCode'),
                text: getText('introduceAValidCode2'),
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
            return;
        }
        else if(response.data.error === 'invalidEmail')
        {
            // De algún modo ya no se puede tener una cuenta con este email
            floatingWindow(
            {
                title: getText('changeEmail'),
                text: getText('emailDuplicated'),
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
        }
        else if(response.data.error !== undefined)
        {
            // Otro error
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('errorCode')}: ${response.data.error}`,
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
        }
        else if(response.data.emailChanged)
        {
            // Todo salió bien, el email se cambió
            floatingWindow(
            {
                title: getText('accountUpdated'),
                button:
                {
                    text: getText('backToHome'),
                    callback: async function()
                    {
                        await closeWindow();
                        mainScreen.hidden = true;
                        loadingScreen.hidden = false;

                        document.getElementById('changeDataConfirmCode').value = '';
                        document.getElementById('changeDataConfirmCode2').value = '';

                        location.reload();
                    }
                }
            });
            return;
        }
        else
        {
            // Error desconocido
            console.log('NO SÉ QUE PASÓ AAAAAAAAAAAA 2: WELCOME DESPAIR');
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: getText('noErrorCode'),
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
            return;
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
                    closeWindow();
                    document.getElementById('changeDataConfirmCodeButton').innerText = getText('verify');
                    actualMenu = 'changeDataEmailCode';
                }
            }
        });
    }

    /*
    if(actualMenu !== 'changeDataEmailCode' || isLocalMode) return;

    const code = changeDataConfirmCodeField.value.trim();

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
    document.getElementById('changeDataConfirmCodeButton').innerText = getText('waitAMoment');

    try
    {
        const response = await encryptHttpCall('/changeEmailCode',
        {

        }, theOtherSecretThing)
        
        const response = await encryptHttpCall('/updateAccountData',
        {
            encrypt:
            {
                code
            },
            key: theSecretThingThatNobodyHaveToKnow
        }, theOtherSecretThing);
        console.log(response);

        if(response.data.updated)
        {
            //Que todo salió bien
            floatingWindow(
            {
                title: getText('accountUpdated'),
                button:
                {
                    text: getText('backToHome'),
                    callback: async function()
                    {
                        await closeWindow();
                        mainScreen.hidden = true;
                        loadingScreen.hidden = false;
                        saveCookie('_login', theSecretThingThatNobodyHaveToKnow);
                        saveCookie('_pswrd', theOtherSecretThing);
                        saveCookie('_localCopy', saveNotesLocally);

                        changeUsernameField.value = '';
                        changeEmailField.value = '';
                        changePasswordField.value = '';
                        comprobePasswordField.value = '';
                        location.reload();
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
                        document.getElementById('changeDataConfirmCodeButton').innerText = getText('verify');
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
                        document.getElementById('changeDataConfirmCodeButton').innerText = getText('verify');
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
                    callback: async function()
                    {
                        document.getElementById('changeDataConfirmCodeButton').innerText = getText('verify');
                        await closeWindow();
                        changeDataEmailCodeMenuGoBackAnimation();
                    }
                }
            });
            changeDataConfirmCodeField.value = '';
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
                    closeWindow();
                    document.getElementById('changeDataConfirmCodeButton').innerText = getText('verify');
                    actualMenu = 'changeDataEmailCode';
                }
            }
        });

        changeDataConfirmCodeField.value = '';
    }
    */
}

function updateEmailsCodesPlaceholders()
{
    document.getElementById('changeDataEmailSent').innerText = email;
    document.getElementById('changeDataEmailSent2').innerText = newEmail;

    document.getElementById('changeDataConfirmCode').placeholder = email;
    document.getElementById('changeDataConfirmCode2').placeholder = newEmail;
}

//Que cuando le des a enter cambie al siguiente campo

changeEmailField.addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') saveChangeDataButton.click();
});

//Botón de comprobar código
document.getElementById('changeDataConfirmCodeButton').addEventListener('click', changeDataComprobeCode);

document.getElementById('changeDataConfirmCode').addEventListener('keyup', function(e)
{
    if(e.key === 'Enter') document.getElementById('changeDataConfirmCode2').focus();
    e.target.value = e.target.value.toUpperCase();
});

document.getElementById('changeDataConfirmCode2').addEventListener('keyup', function(e)
{
    if(e.key === 'Enter') changeDataComprobeCode();
    e.target.value = e.target.value.toUpperCase();
});
