function fieldsAreValid(emailField)
{
    let areValid = true;
    if(!emailIsValid()) areValid = false;

    return areValid;

    function emailIsValid()
    {
        if(emailField === undefined || emailField === null)
        {
            emailText(getText('fieldCannotBeEmpty'));
            return false;
        }

        emailField = emailField.trim();

        if(emailField === '')
        {
            emailText(getText('fieldCannotBeEmpty'));
            return false;
        }

        const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(regex.test(emailField))
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

}

function emailText(txt)
{
    if(txt === undefined) txt = '';
    document.getElementById('emailText').innerText = txt;
}
