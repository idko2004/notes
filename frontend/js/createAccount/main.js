let username;
let email;
let password;
let confirmPassword;

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

//Asignar funcionamiento a los botones
document.getElementById('cancelButton').addEventListener('click', function()
{
    location.href = 'index.html';
});

document.getElementById('continueButton').addEventListener('click', function()
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

    //Animación para cambiar a la pantalla de comprobar correo electrónico
    let endAnimationCallback = function(e)
    {
        console.log(emailCodeMenu);
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

//Quitar la pantalla de carga
document.getElementById('loadingScreen').hidden = true;
document.getElementById('mainScreen').hidden = false;
actualMenu = 'main';