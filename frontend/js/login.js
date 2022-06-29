let canClick_login = true;

let codePassword;
let loginPassword;

document.getElementById('loginButton').addEventListener('click', async function(e)
{
    if(theActualThing !== 'login') return;
    if(!canClick_login) return;
    canClick_login = false;

    e.target.innerText = getText('logginIn');

    const username = document.getElementById('usernameField').value.trim();
    const password = document.getElementById('passwordField').value;

    //Comprobar que todos los campos estén completos
    if(username === '' && password === '')
    {
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('login_none_title'),
            text: getText('login_none_text'),
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
    else if(username === '')
    {
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('login_username_title'),
            text: getText('login_username_text'),
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
    else if(password === '')
    {
        theActualThing = 'ventana';
        floatingWindow(
        {
            title: getText('login_password_title'),
            text: getText('login_password_text'),
            buttons:
            [
                {
                    text: getText('forgotPassword'),
                    primary: false,
                    callback: function()
                    {
                        location.href = 'forgotMyPassword.html';
                    }
                },
                {
                    text: getText('ok'),
                    primary: true,
                    callback: function()
                    {
                        e.target.innerText = getText('login');
                        canClick_login = true;
                        theActualThing = 'login';
                        closeWindow();
                    }
                }
            ]
        });
        return;
    }

    //Realizar la llamada para iniciar sesión
    try
    {
        //const response = await axios.get(`${path}/getSessionID`, {headers: {username, password}});
        const response = await encryptHttpCall('/getSessionID', {encrypt: {username, password}, code: codePassword}, loginPassword);
        console.log(response);
        if(response.data.error === undefined && response.data.decrypt.key !== undefined && response.data.decrypt.pswrd !== undefined) //Clave obtenida con éxito
        {
            console.log('Clave obtenida');
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
            menuButtonText();
            resizeTwice();
            theActualThing = 'note';
        }
        else if(response.data.error === 'wrongPassword') //Contraseña incorrecta
        {
            console.log('Contraseña inválida');
            e.target.innerText = getText('login');
            theActualThing = 'ventana';
            floatingWindow(
            {
                title: getText('login_wrongPassword_title'),
                text: getText('login_wrongPassword_text'),
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
                        callback: function()
                        {
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

document.getElementById('signUpButton').addEventListener('click', function()
{
    if(theActualThing !== 'login') return;
    location.href=`signup.html#lang=${actualLanguage}`
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
    menuButtonText();
    resizeTwice();
    theActualThing = 'note';
});

//Que cuando le das a enter pase al siguiente campo
document.getElementById('usernameField').addEventListener('keydown', function(e)
{
    if(theActualThing !== 'login') return;
    if(e.key === 'Enter') document.getElementById('passwordField').focus();
})

document.getElementById('passwordField').addEventListener('keydown', function(e)
{
    if(theActualThing !== 'login') return;
    if(e.key === 'Enter') document.getElementById('loginButton').click();
});

async function requestLoginPassword()
{
    codePassword = "_" + Math.random().toString().split('.')[1];
    try
    {
        const response = await axios.post(`${path}/generateLoginPassword`, {code: codePassword});

        if(response.data.error !== undefined || response.data.secret === undefined)
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
            console.log('Secret key obtained');
        }
    }
    catch
    {
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

}