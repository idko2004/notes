let canClick_login = true;
document.getElementById('loginButton').addEventListener('click', async function(e)
{
    if(!canClick_login) return;
    canClick_login = false;

    e.target.innerText = getText('logginIn');

    const username = document.getElementById('usernameField').value.trim();
    const password = document.getElementById('passwordField').value;

    //Comprobar que todos los campos estén completos
    if(username === '' && password === '')
    {
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
                    closeWindow();
                }
            }
        });
        return;
    }
    else if(username === '')
    {
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
                    closeWindow();
                }
            }
        });
        return;
    }
    else if(password === '')
    {
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
        const response = await axios.get(`${path}/getSessionID`, {headers: {username, password}});
        console.log(response);
        if(response.data.error === undefined && response.data.key !== undefined) //Clave obtenida con éxito
        {
            console.log('Clave obtenida');
            isLocalMode = false;
            saveKey('_login', response.data.key);
            theSecretThingThatNobodyHasToKnow = response.data.key;
    
            document.getElementById('loginScreen').hidden = true;
            loadingScreen.hidden = false;
            canClick_login = true;
    
            await loadNotesList();
            menuButtonText();
            resizeTwice();
        }
        else if(response.data.error === 'wrongPassword') //Contraseña incorrecta
        {
            console.log('Contraseña inválida');
            e.target.innerText = getText('login');
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
                        closeWindow();
                    }
                }
            });
        }
        else if(response.data.error === 'userDontExist') //Usuario incorrecto
        {
            console.log('usuario no existe');
            e.target.innerText = getText('login');
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
                            closeWindow();
                        }
                    }
                ]
            });
        }
        else
        {
            console.log('error desconocido iniciando sesión');
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: getText('login_error_text'),
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        canClick_login = true;
                        closeWindow();
                    }
                }
            });
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
                callback: function()
                {
                    canClick_login = true;
                    e.target.innerText = getText('login');
                    closeWindow();
                }
            }
        })
    }
});

document.getElementById('signUpButton').addEventListener('click', function()
{
    location.href=`signup.html#lang=${actualLanguage}`
});

document.getElementById('localModeButton').addEventListener('click',function()
{
    isLocalMode = true;
    theSecretThingThatNobodyHasToKnow = 'local';
    saveKey('_login','local');

    loadNotesList();
    document.getElementById('loginScreen').hidden = true;

    document.getElementById('noteScreen').hidden = false;
    menuButtonText();
    resizeTwice();
});

//Que cuando le das a enter pase al siguiente campo
document.getElementById('usernameField').addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') document.getElementById('passwordField').focus();
})

document.getElementById('passwordField').addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') document.getElementById('loginButton').click();
});