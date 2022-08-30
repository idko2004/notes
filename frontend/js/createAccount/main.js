const path = 'http://localhost:8888';

let account =
{
    username: undefined,
    email: undefined,
    password: undefined
}

let actualMenu;
//main
//email
//ventana

const mainMenu = document.getElementById('mainMenu');
const emailCodeMenu = document.getElementById('emailCodeMenu');

const usernameField = document.getElementById('usernameField');
const emailField = document.getElementById('emailField');
const passwordField = document.getElementById('passwordField');
const comprobePasswordField = document.getElementById('comprobePasswordField');
const continueButton = document.getElementById('continueButton');

//Asignar funcionamiento a los botones
document.getElementById('cancelButton').addEventListener('click', function()
{
    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        mainMenu.hidden = true;
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
        location.href = 'index.html';
    }

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});

continueButton.addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    //Limpiar los campos de errores
    usernameText();
    emailText();
    passwordText();

    //Obtener los valores
    const usernameFieldValue = usernameField.value;
    const emailFieldValue = emailField.value;
    const passwordFieldValue = passwordField.value;
    const comprobePasswordFieldValue = comprobePasswordField.value;

    //Comprobar si son válidos
    if(!fieldsAreValid(usernameFieldValue, emailFieldValue, passwordFieldValue, comprobePasswordFieldValue)) return;

    account.email = emailFieldValue.trim();
    account.password = passwordFieldValue;

    account.username = usernameFieldValue.trim();
    if(account.username === '')
    {
        let emailName = account.email.split('@')[0];
        emailName = emailName[0].toUpperCase() + emailName.slice(1);
        account.username = emailName;
    }

    updateWeSentAnEmail();
    sendEmail();

    //Animación para cambiar a la pantalla de comprobar correo electrónico
    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        mainMenu.hidden = true;
        emailCodeMenu.hidden = false;

        emailCodeMenu.classList.remove('closeMenu');
        emailCodeMenu.classList.add('openMenu');

        actualMenu = 'email';
        window.scrollTo(0,0);

        mainMenu.removeEventListener('animationend', endAnimationCallback);
    }

    mainMenu.classList.remove('openMenu');
    mainMenu.classList.add('closeMenu');

    mainMenu.addEventListener('animationend', endAnimationCallback);
});


//Comprobar si tenemos los datos encritar
const deviceID = getSpecificCookie('_id');
const idPassword = getSpecificCookie('_idPswrd');
if([deviceID, idPassword].includes(null))
{
    actualMenu = 'ventana';
    document.getElementById('loadingScreen').hidden = true;
    floatingWindow(
    {
        title: getText('reenter'),
        text: getText('reenter_createAccount'),
        button:
        {
            text: getText('ok'),
            callback: function()
            {
                location.href = 'index.html';
            }
        }
    });
}
else
{
    //Quitar la pantalla de carga
    document.getElementById('loadingScreen').hidden = true;
    document.getElementById('mainScreen').hidden = false;
    actualMenu = 'main';
}

//Pasar de un campo a otro pulsando enter
usernameField.addEventListener('keypress', function(e)
{
    if(e.key === 'Return' || e.key === 'Enter') emailField.focus();
});

emailField.addEventListener('keypress', function(e)
{
    if(e.key === 'Return' || e.key === 'Enter') passwordField.focus();
});

passwordField.addEventListener('keypress', function(e)
{
    if(e.key === 'Return' || e.key === 'Enter') comprobePasswordField.focus();
});

comprobePasswordField.addEventListener('keypress', function(e)
{
    if(e.key === 'Return' || e.key === 'Enter') continueButton.click();
});

//Placeholders
emailField.addEventListener('keyup', updateUsernamePlaceholder);

function updateUsernamePlaceholder()
{
    let placeholder = emailField.value.split('@')[0];
    if(placeholder.trim() === '') placeholder = 'Adam Smith';
    else
    {
        placeholder = placeholder[0].toUpperCase() + placeholder.slice(1);
    }
    usernameField.placeholder = placeholder;
}

emailField.placeholder = getText('emailExample');
passwordField.placeholder = getText('hyperSecurePassword');
comprobePasswordField.placeholder = getText('typeItAgain');