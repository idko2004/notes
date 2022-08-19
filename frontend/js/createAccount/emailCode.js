function updateWeSentAnEmail()
{
    document.getElementById('changeDataEmailSent').innerText = account.email;
}

document.getElementById('changeDataCancelCodeButton').addEventListener('click', function()
{
    if(actualMenu !== 'email') return;

    usernameField.value = '';
    emailField.value = '';
    passwordField.value = '';
    comprobePasswordField.value = '';
    updateUsernamePlaceholder();

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        emailCodeMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);

        emailCodeMenu.removeEventListener('animationend', endAnimationCallback);
    }

    emailCodeMenu.classList.remove('openMenu');
    emailCodeMenu.classList.add('closeMenu');

    emailCodeMenu.addEventListener('animationend', endAnimationCallback);

});

async function sendEmail()
{
    
}