let currentLoginSection;

let codePassword;
let loginPassword;

let userEmail;

const emailLoginSection = document.getElementById('emailLoginSection');
const loadLoginSection = document.getElementById('loadLoginSection');
const emailCodeLoginSection = document.getElementById('emailCodeLoginSection');
const reloadLoginSection = document.getElementById('reloadLoginSection');

showLoginSection('email');

function showLoginSection(section)
{
    switch(section)
    {
        case 'email':
            emailLoginSection.hidden = false;

            loadLoginSection.hidden = true;
            emailCodeLoginSection.hidden = true;
            reloadLoginSection.hidden = true;
            
            currentLoginSection = 'email';
        break;

        case 'load':
            loadLoginSection.hidden = false;

            emailLoginSection.hidden = true;
            emailCodeLoginSection.hidden = true;
            reloadLoginSection.hidden = true;

            currentLoginSection = 'load';
        break;

        case 'code':
            emailCodeLoginSection.hidden = false;

            emailLoginSection.hidden = true;
            loadLoginSection.hidden = true;
            reloadLoginSection.hidden = true;

            currentLoginSection = 'code';
        break;

        case 'reload':
            reloadLoginSection.hidden = false;

            emailLoginSection.hidden = true;
            loadLoginSection.hidden = true;
            emailCodeLoginSection.hidden = true;

            currentLoginSection = 'reload';
        break;
    }
}


document.getElementById('loginButton').addEventListener('click', async function()
{
    if(theActualThing !== 'login') return;
    if(currentLoginSection !== 'email') return;

    showLoginSection('load');

    const email = document.getElementById('emailField').value.trim();

    //Comprobar que todos los campos estén completos
    if(email === '')
    {
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('login_email_title'),
            text: getText('login_email_text'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    theActualThing = 'login';
                    showLoginSection('email');
                    closeWindow();
                }
            }
        });
        return;
    }

    if([codePassword, loginPassword].includes(undefined))
    {
        floatingWindow(
        {
            title: getText('somethingWentWrong'),
            text: `${getText('login_error_text')}\n${getText('errorCode')}: a thing (${codePassword === undefined}) or another thing (${loginPassword === undefined}) is undefined`,
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
    }

    try
    {
        const response = await encryptHttpCall('/login',
        {
            deviceID: codePassword,
            encrypt:
            {
                email
            }
        }, loginPassword);

        console.log(response);

        if(response.data.error === 'userDontExist')
        {
            // Usuario no existe
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('login_wrongUser_title'),
                text: getText('login_wrongUser_text'),
                buttons:
                [
                    {
                        text: getText('createAccount'),
                        callback: async function()
                        {
                            await closeWindow();
                            location.href = 'signup.html'
                        }
                    },
                    {
                        text: getText('ok'),
                        primary: true,
                        callback: function()
                        {
                            theActualThing = 'login';
                            showLoginSection('email');
                            closeWindow();
                        }
                    }
                ]
            });
        }
        else if(response.data.error !== undefined)
        {
            // Algún error raro
            console.log('error desconocido iniciando sesión');
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('login_error_text')}\nerror code: ${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        theActualThing = 'login';
                        showLoginSection('email');
                        closeWindow();
                    }
                }
            });
        }
        else if(response.data.emailSent)
        {
            // Habilitar el campo para el código
            showLoginSection('code');
            userEmail = email;
        }
        else
        {
            // Algún error aún más raro
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('noErrorCode')}\n\n${response.data}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        theActualThing = 'login';
                        showLoginSection('email');
                        closeWindow();
                    }
                }
            });
        }
    }
    catch(err)
    {
        console.log(err);
        floatingWindow(
        {
            title: getText('somethingWentWrong'),
            text: `${getText('login_error_text')}\nerror code: ${err.message}`,
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    theActualThing = 'login';
                    showLoginSection('email');
                    closeWindow();
                }
            }
        });
    }
});

document.getElementById('sendCodeLoginButton').addEventListener('click', async function()
{
    if(theActualThing !== 'login') return;
    if(currentLoginSection !== 'code') return;

    showLoginSection('load');

    code = document.getElementById('emailCodeLoginField').value;
    code = code.toUpperCase().trim();

    if(code.length !== 5)
    {
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('introduceAValidCode'),
            text: getText('introduceAValidCode2'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    theActualThing = 'login';
                    showLoginSection('code');
                    closeWindow();
                }
            }
        });
        return;
    }

    try
    {
        const response = await encryptHttpCall('/loginCode',
        {
            deviceID: codePassword,
            encrypt:
            {
                code,
                email: userEmail
            }
        }, loginPassword);
        console.log(response);

        if(response.data.error === 'invalidCode')
        {
            // Código no válido
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('introduceAValidCode'),
                text: getText('introduceAValidCode2'),
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        theActualThing = 'login';
                        showLoginSection('code');
                        closeWindow();
                    }
                }
            });
        }
        else if(response.data.error !== undefined)
        {
            // Algún error raro
            console.log('error desconocido iniciando sesión');
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('login_error_text')}\nerror code: ${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        theActualThing = 'login';
                        showLoginSection('code');
                        closeWindow();
                    }
                }
            });
        }
        else if(response.data.decrypt.key !== undefined && response.data.decrypt.pswrd !== undefined)
        {
            // Se inició sesión correctamente
            console.log('Clave obtenida');
            console.log('la nueva contraseña', response.data.decrypt.pswrd);

            isLocalMode = false;
            theSecretThingThatNobodyHasToKnow = response.data.decrypt.key;
            theOtherSecretThing = response.data.decrypt.pswrd;

            saveKey('_login', theSecretThingThatNobodyHasToKnow);
            saveKey('_pswrd', theOtherSecretThing);
            saveKey('_email', userEmail);
            
            codePassword = undefined;
            loginPassword = undefined;

            document.getElementById('loginScreen').hidden = true;
            showLoginSection('email');
            loadingScreen.hidden = false;

            checkLocalCopyValue();
            await loadNotesList();
            spellcheckStatus();
            menuButtonText();
            resizeTwice();
            theActualThing = 'note';
        }
        else
        {
            // Algún error muy raro
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('noErrorCode')}\n\n${response.data}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        theActualThing = 'login';
                        showLoginSection('email');
                        closeWindow();
                    }
                }
            });
        }
    }
    catch(err)
    {
        console.log(err);
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('somethingWentWrong'),
            text: `${getText('login_error_text')}\nerror code: ${err.message}`,
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    theActualThing = 'login';
                    showLoginSection('code');
                    loadingScreen.hidden = true;
                    document.getElementById('loginScreen').hidden = false;
                    closeWindow();
                }
            }
        });
    }
});

/*document.getElementById('loginButton').addEventListener('click', async function(e)
{
    if(theActualThing !== 'login') return;
    if(!canClick_login) return;
    canClick_login = false;

    e.target.innerText = getText('logginIn');

    const email = document.getElementById('emailField').value.trim();

    //Comprobar que todos los campos estén completos
    if(email === '')
    {
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('login_email_title'),
            text: getText('login_email_text'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    e.target.innerText = getText('login');
                    canClick_login = true;
                    theActualThing = 'login';
                    closeWindow();
                }
            }
        });
        return;
    }

    if([codePassword, loginPassword].includes(undefined))
    {
        floatingWindow(
        {
            title: getText('somethingWentWrong'),
            text: `${getText('login_error_text')}\n${getText('errorCode')}: a thing (${codePassword === undefined}) or another thing (${loginPassword === undefined}) is undefined`,
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
    }

    //Realizar la llamada para iniciar sesión
    try
    {
        //const response = await axios.get(`${path}/getSessionID`, {headers: {username, password}});
        console.log('loginPassword', loginPassword);
        console.log('http: iniciando sesión');
        const response = await encryptHttpCall('/login',
        {
            encrypt:
            {
                email
            },
            code: codePassword
        }, loginPassword);
        
        console.log(response);
        if(response.data.error === undefined && response.data.decrypt.key !== undefined && response.data.decrypt.pswrd !== undefined) //Clave obtenida con éxito
        {
            console.log('Clave obtenida');
            console.log('la nueva contraseña', response.data.decrypt.pswrd);

            isLocalMode = false;
            theSecretThingThatNobodyHasToKnow = response.data.decrypt.key;
            theOtherSecretThing = response.data.decrypt.pswrd;

            saveKey('_login', theSecretThingThatNobodyHasToKnow);
            saveKey('_pswrd', theOtherSecretThing);
            
            codePassword = undefined;
            loginPassword = undefined;

            document.getElementById('loginScreen').hidden = true;
            loadingScreen.hidden = false;
            canClick_login = true;

            checkLocalCopyValue();
            await loadNotesList();
            spellcheckStatus();
            menuButtonText();
            resizeTwice();
            theActualThing = 'note';
        }
        else if(response.data.error === 'userDontExist') //Usuario incorrecto
        {
            console.log('usuario no existe');
            e.target.innerText = getText('login');
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('login_wrongUser_title'),
                text: getText('login_wrongUser_text'),
                buttons:
                [
                    {
                        text: getText('createAccount'),
                        callback: async function()
                        {
                            await closeWindow();
                            location.href = 'signup.html'
                        }
                    },
                    {
                        text: getText('ok'),
                        primary: true,
                        callback: function()
                        {
                            canClick_login = true;
                            theActualThing = 'login';
                            closeWindow();
                        }
                    }
                ]
            });
        }
        else
        {
            console.log('error desconocido iniciando sesión');
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('login_error_text')}\nerror code: ${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        canClick_login = true;
                        theActualThing = 'login';
                        closeWindow();
                    }
                }
            });
        }
    }
    catch
    {
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('ups'),
            text: getText('serverDown'),
            button:
            {
                text: getText('ok'),
                callback: function()
                {
                    canClick_login = true;
                    e.target.innerText = getText('login');
                    theActualThing = 'login';
                    closeWindow();
                }
            }
        })
    }
});
*/

document.getElementById('signUpButton').addEventListener('click', function()
{
    if(theActualThing !== 'login') return;
    saveCookie('_id', codePassword);
    saveCookie('_idPswrd', loginPassword);
    location.href=`createAccount.html#lang=${actualLanguage};colortheme=${colorTheme}`;
});

document.getElementById('localModeButton').addEventListener('click',function()
{
    if(theActualThing !== 'login') return;

    isLocalMode = true;
    theSecretThingThatNobodyHasToKnow = 'local';
    localCopy = undefined;
    saveKey('_login','local');

    loadNotesList();
    document.getElementById('loginScreen').hidden = true;

    document.getElementById('noteScreen').hidden = false;
    spellcheckStatus();
    menuButtonText();
    resizeTwice();
    theActualThing = 'note';
});

//Que cuando le das a enter pase al siguiente campo
document.getElementById('emailField').addEventListener('keydown', function(e)
{
    if(theActualThing !== 'login') return;
    if(e.key === 'Enter') document.getElementById('loginButton').click();
});

//Botón de configuración
document.getElementById('loginSettings').addEventListener('click', function()
{
    if(theActualThing !== 'login') return;
    localManageAccount();
});

async function requestLoginPassword()
{
    try
    {
        let deviceID = getKey('_id');
        let pswrd = getKey('_pswrd2');

        //Requerir un nuevo deviceID
        if([undefined, null, '', 'undefined', 'null'].includes(deviceID) || [undefined, null, '', 'undefined', 'null'].includes(pswrd)) await requestNewDeviceID();
        //Ya tenemos un código y queremos comprobar que sigue válido
        else
        {
            console.log('http: comprobando si la clave de inicio de sesión sigue siendo válida');
            const response = await axios.post(`${path}/generateLoginPassword`, {code: deviceID});
            console.log(response);

            if(response.data.stillValid === undefined)
            {
                floatingWindow(
                {
                    title: getText('somethingWentWrong'),
                    text: `${getText('errorCode')}: ${response.data.error}`,
                    button:
                    {
                        text: getText('ok'),
                        callback: closeWindow
                    }
                });
            }
            else if(!response.data.stillValid) await requestNewDeviceID();
            else
            {
                console.log('al parecer sigue siendo válida');
                loginPassword = pswrd;
                codePassword = deviceID;
            }
        }
    }
    catch
    {
        hideLoginFields();
        floatingWindow(
        {
            title: getText('ups'),
            text: getText('serverDown'),
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });
    }

    async function requestNewDeviceID()
    {
        console.log('http: requiriendo una nueva clave de inicio de sesión');
        const response = await axios.post(`${path}/generateLoginPassword`, {code: 'requesting'});
        console.log(response);
        console.log('contraseña', response.data.secret);
        console.log('id', response.data.id);

        if(response.data.error !== undefined || response.data.secret === undefined || response.data.id === undefined)
        {
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('errorCode')}: ${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: closeWindow
                }
            });
        }
        else
        {
            loginPassword = response.data.secret;
            codePassword = response.data.id;
            saveKey('_id', codePassword);
            saveKey('_pswrd2', loginPassword);
            console.log('Secret key obtained');
        }
    }

    function hideLoginFields()
    {
        console.log('Escondiendo botones de iniciar sesión debido a que no se pudo conectar con el servidor');
        showLoginSection('reload');
    }
}

document.getElementById('reloadLoginButton').addEventListener('click', function()
{
    location.reload();
});