function fieldsAreValid(username, email, password, comprobePassword)
{
    if(!usernameIsValid()) return false;
    if(!emailIsValid()) return false;
    if(!passwordIsValid()) return false;
    if(!comprobePasswordIsValid()) return false;

    function usernameIsValid()
    {
        return true;
    }

    function emailIsValid()
    {
        if(email === undefined || email === null || email.trim() === '')
        {
            emailText(getText('fieldCannotBeEmpty'));
            return false;
        }
    
        email = value.trim();
    
        const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(regex.test(email))
        {
            //Es válido
            console.log('El email es válido');
            return true;
        }
        else
        {
            emailText(getText('invalidEmail'));
            return false;
        }
    }

    function passwordIsValid()
    {
        return true;
    }

    function comprobePasswordIsValid()
    {
        return true;
    }
}

function usernameText(txt)
{
    if(txt === undefined) txt = '';
    document.getElementById('usernameText').innerText = txt;
}

function emailText(txt)
{
    if(txt === undefined) txt = '';
    document.getElementById('emailText').innerText = txt;
}

function passwordText(txt)
{
    if(txt === undefined) txt = '';
    document.getElementById('passwordText').innerText = txt;
}