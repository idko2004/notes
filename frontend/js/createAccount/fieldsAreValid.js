function fieldsAreValid(username, email, password, comprobePassword)
{
    let areValid = true;
    if(!usernameIsValid()) areValid = false;
    if(!emailIsValid()) areValid = false;
    if(!passwordIsValid()) areValid = false;
    else if(!comprobePasswordIsValid()) areValid = false;

    return areValid;

    function usernameIsValid()
    {
        if(username === undefined || username === null || username.trim() === '')
        {
            username = email.split('@')[0];
        }
        else if(username.length > 30)
        {
            usernameText(getText('newNote_tooLongName_title'));
            return false;
        }
        else username = username.trim();
        return true;
    }

    function emailIsValid()
    {
        if(email === undefined || email === null)
        {
            emailText(getText('fieldCannotBeEmpty'));
            return false;
        }

        email = email.trim();

        if(email === '')
        {
            emailText(getText('fieldCannotBeEmpty'));
            return false;
        }

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
        if(password === undefined || password === null || password.trim() === '')
        {
            passwordText(getText('fieldCannotBeEmpty'));
            return false;
        }
        else if(password.length < 8)
        {
            passwordText(getText('passwordMustContains'));
            return false;
        }
        else if(password.length > 30)
        {
            passwordText(getText('tooLongPassword'));
            return false;
        }
    
        const capitalsRegex = new RegExp('[A-Z]+');
        const notCapitalsRegex = new RegExp('[a-z]+');
        const numbersRegex = new RegExp('[0-9]+');
    
        const containsCapitals = capitalsRegex.test(password);
        const containsNotCapitals = notCapitalsRegex.test(password);
        const containsNumbers = numbersRegex.test(password);
    
        console.log('containsCapitals', containsCapitals);
        console.log('containsNotCapitals', containsNotCapitals)
        console.log('containsNumbers', containsNumbers);
        console.log(containsCapitals && containsNotCapitals && containsNumbers);
    
        if(!containsCapitals || !containsNotCapitals || !containsNumbers)
        {
            passwordText(getText('passwordMustContains'));
            return false;
        }

        return true;
    }

    function comprobePasswordIsValid()
    {
        if(password === comprobePassword) return true;
        else
        {
            passwordText(getText('passwordsDontMatch'));
            return false;
        }
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