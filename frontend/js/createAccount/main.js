const path = 'http://localhost:8888';

let email;

let actualMenu;
//main
//email
//ventana

const mainMenu = document.getElementById('mainMenu');
const emailCodeMenu = document.getElementById('emailCodeMenu');

const emailField = document.getElementById('emailField');
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
    emailText();

    //Obtener los valores
    const emailFieldValue = emailField.value;

    //Comprobar si son válidos
    if(!fieldsAreValid(emailFieldValue)) return;

    email = emailFieldValue.trim();

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
theOtherSecretThing = getSpecificCookie('_pswrd');
if([deviceID, theOtherSecretThing].includes(null))
{
    console.log('deviceID', deviceID);
    console.log('theOtherSecretThing', theOtherSecretThing);
    actualMenu = 'ventana';
    document.getElementById('loadingScreen').hidden = true;
    floatingWindow(
    {
        title: getText('reenter'),
        text: getText('reenter_createAccount'),
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
else
{
    //Quitar la pantalla de carga
    document.getElementById('loadingScreen').hidden = true;
    document.getElementById('mainScreen').hidden = false;
    actualMenu = 'main';
}

emailField.addEventListener('keypress', function(e)
{
    if(e.key === 'Return' || e.key === 'Enter') continueButton.click();
});

emailField.placeholder = getText('emailExample');
