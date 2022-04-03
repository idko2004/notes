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
}

document.getElementById('goBackChangeDataMenu').addEventListener('click', function()
{
    if(actualMenu !== 'changeData') return;

    changeDataMenu.hidden = true;

    changeUsernameField.value = '';
    changeEmailField.value = '';
    changePasswordField.value = '';
    comprobePasswordField.value = '';

    mainMenu.hidden = false;
    actualMenu = 'main';
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
                title: 'Nombre de usuario',
                text: 'El nombre de usuario es demasiado largo.',
                button:
                {
                    text: 'Aceptar',
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
                title: 'Correo electrónico',
                text: 'Introduce un correo electrónico válido.',
                button:
                {
                    text: 'Aceptar',
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
                title: 'Contraseña',
                text: 'La contraseña es demasiado corta. (Mínimo 8 caracteres)',
                button:
                {
                    text: 'Aceptar',
                    callback: closeWindow
                }
            });
            return;
        }

        if(newPasswordLength > 20)
        {
            floatingWindow(
            {
                title: 'Contraseña',
                text: 'La contraseña es demasiado larga. (Máximo 20 caracteres)',
                button:
                {
                    text: 'Aceptar',
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
                title: 'Contraseña',
                text: 'La contraseña debe tener mayúsculas, minúsculas y números.',
                button:
                {
                    text: 'Aceptar',
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
                title: 'Contraseña',
                text: 'Las contraseñas no coinciden.',
                button:
                {
                    text: 'Aceptar',
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
            title: 'Nada ha cambiado',
            text: 'Modifica algún dato para poder actualizar tu perfil, si no quieres modificar nada haz click en el botón "Cancelar"',
            button:
            {
                text: 'Aceptar',
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
        title: 'Entonces quedará así:',
        text: `Nombre de usuario:\n${newUsername}\n\nCorreo electrónico:\n${newEmail}\n\nContraseña:\n${pswrd}\n\n¿Está bien así?`,
        buttons:
        [
            {
                text: 'No, cancelar',
                primary: false,
                callback: closeWindow
            },
            {
                text: 'Sí, guarda estos datos',
                primary: true,
                callback: async function()
                {
                    closeWindow();
                    document.getElementById('changeDataEmailSent').innerText = email;
                    changeDataMenu.hidden = true;
                    changeDataEmailCodeMenu.hidden = false;
                    actualMenu = 'changeDataEmailCode';

                    //Hacer la llamada al servidor para actualizar a los nuevos datos, generar un código y enviar el email
                }
            }
        ]
    });
});