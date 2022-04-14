let canClick_login = true;
document.getElementById('loginButton').addEventListener('click', async function(e)
{
    if(!canClick_login) return;
    canClick_login = false;

    e.target.innerText = 'Iniciando sesión...';

    const username = document.getElementById('usernameField').value.trim();
    const password = document.getElementById('passwordField').value;

    //Comprobar que todos los campos estén completos
    if(username === '' && password === '')
    {
        floatingWindow(
        {
            title: 'Introduce tus datos',
            text: 'No puedes iniciar sesión si no nos dices cuál es tu usuario y contraseña.\nSi no quieres crear una cuenta puedes probar el modo local.',
            button:
            {
                text: 'Aceptar',
                callback: function()
                {
                    e.target.innerText = 'Iniciar sesión';
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
            title: '¿Cómo te llamas?',
            text: 'Escribe tu nombre de usuario para poder iniciar sesión.',
            button:
            {
                text: 'Aceptar',
                callback: function()
                {
                    e.target.innerText = 'Iniciar sesión';
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
            title: '¿Cuál es tu contraseña?',
            text: 'Sin tu contraseña no puedes iniciar sesión, si no la recuerdas podemos hacer algo para recuperarla.',
            buttons:
            [
                {
                    text: 'Olvidé mi contraseña',
                    primary: false,
                    callback: function()
                    {
                        let a =document.createElement('a');
                        a.style.display = 'none';
                        a.href = 'forgotMyPassword.html';
                        document.body.appendChild(a);
                        a.click();
                    }
                },
                {
                    text: 'Aceptar',
                    primary: true,
                    callback: function()
                    {
                        e.target.innerText = 'Iniciar sesión';
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
    
            loadNotesList();
            menuButtonText();
            resizeTwice();
        }
        else if(response.data.error === 'wrongPassword') //Contraseña incorrecta
        {
            console.log('Contraseña inválida');
            e.target.innerText = 'Iniciar sesión';
            floatingWindow(
            {
                title: 'Contraseña incorrecta',
                text: 'Intenta con otra contraseña. Si no te acuerdas siempre puedes restablecerla.',
                button:
                {
                    text: 'Aceptar',
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
            e.target.innerText = 'Iniciar sesión';
            floatingWindow(
            {
                title: 'Este usuario no existe',
                text: 'Si aún no tienes una cuenta, puedes crear una. Si ya tienes una cuenta revisa que el nombre esté bien escrito.',
                buttons:
                [
                    {
                        text: 'Crear cuenta',
                        callback: function()
                        {
                            location.href = 'signup.html'
                        }
                    },
                    {
                        text: 'Aceptar',
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
                title: 'Algo salió mal',
                text: 'Hubo un error al iniciar sesión',
                button:
                {
                    text: 'Aceptar',
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
            title: 'Vaya...',
            text: 'Parece que el servidor se ha caído, prueba intentarlo de nuevo más tarde.',
            button:
            {
                text: 'Aceptar',
                callback: function()
                {
                    canClick_login = true;
                    e.target.innerText = 'Iniciar sesión';
                    closeWindow();
                }
            }
        })
    }
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