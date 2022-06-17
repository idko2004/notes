const path = 'http://localhost:3000';

let step = 0;

//TODO: al ingresar el código que se ponga en mayúsculas automáticamente, revisar error que sale en la consola al cargar la página

let username;
let email;
let password;
let comprobedPassword;

//Hay datos guardados
const savedEmail = localStorage.getItem('_email');
if(savedEmail !== null)
{
    const savedPassword = localStorage.getItem('_password');
    const savedUsername = localStorage.getItem('_username');

    username = savedUsername;
    email = savedEmail;
    password = savedPassword;
    comprobedPassword = savedPassword;
}

const text = document.getElementById('text');
const tinyText = document.getElementById('tinyText');
const inputField = document.getElementById('inputField');
const nextButton = document.getElementById('nextButton');
const backButton = document.getElementById('backButton');
const changeEmailButton = document.getElementById('changeEmailButton');
const reloadButton = document.getElementById('reloadButton');

nextButton.addEventListener('click', comprobeThisStep);
inputField.addEventListener('keyup', function(e)
{
    if(e.key === 'Enter') comprobeThisStep();
    else if(step === 4) e.target.value = e.target.value.toUpperCase();
});

backButton.addEventListener('click', goBack);

reloadButton.addEventListener('click', function()
{
    location.reload();
});

comprobeServerWorks();

async function comprobeServerWorks()
{
    try
    {
        console.log('pingeando server');
        const ping = await axios.get(`${path}/ping`);
        console.log(ping);
        if(ping.data === 'pong!') displayNextStep();
    }
    catch
    {
        text.innerText = getText('ups');
        setTinyText(getText('serverDown'));
        reloadButton.hidden = false;
    }
}

//Step 0 = email
//Step 1 = username
//Step 2 = password
//Step 3 = comprobe password
//Step 4 = code

function displayNextStep()
{
    switch(step)
    {
        case 0: displayEmail(); break;
        case 1: displayUsername(); break;
        case 2: displayPassword(); break;
        case 3: displayConfirmPassword(); break;
        case 4: displayEmailCode(); break;
        default:
            text.innerText = getText('somethingWentWrong');
            setTinyText(getText('pageToReload'));
            setTimeout(function()
            {
                location.reload();
            }, 2000);
    }
}

function comprobeThisStep()
{
    switch(step)
    {
        case 0: comprobeEmail(); break;
        case 1: comprobeUserName(); break;
        case 2: comprobePassword(); break;
        case 3: comprobeConfirmPassword(); break;
        case 4: comprobeEmailCode(); break;
        case 5: location.href='index.html'; break;
    }
}

function goBack()
{
    switch(step)
    {
        case 0:
            location.href='index.html';
            return;

        case 1:
            email = undefined;
            username = undefined;
            break;
        
        case 2:
            username = undefined;
            password = undefined;
            comprobedPassword = undefined;
            break;

        case 3:
            password = undefined;
            comprobedPassword = undefined;
            break;

        case 4:
            password = undefined;
            comprobedPassword = undefined;
            step--;
            break;

        default: return;
    }
    step--;
    displayNextStep();
}

function setTinyText(content)
{
    if(content === undefined)
    {
        tinyText.hidden = true;
        tinyText.innerText = '';
    }
    else
    {
        tinyText.hidden = false;
        tinyText.innerText = content;
    }
}

function clearInputField(type, placeholder)
{
    inputField.value = '';
    if(type !== undefined) inputField.attributes.type.value = type;
    if(placeholder !== undefined) inputField.attributes.placeholder.value = placeholder
}

function displayEmail()
{
    if(email !== undefined)
    {
        comprobeEmail();
        return;
    }

    text.innerText = getText('email');
    setTinyText();
    clearInputField('text', getText('emailExample'));
    backButton.hidden = false;
    changeEmailButton.hidden = true;
    inputField.hidden = false;
    nextButton.hidden = false;
}

function comprobeEmail()
{
    let value;
    if(email === undefined) value = inputField.value;
    else value = email;

    if(value === undefined || value === null || value.trim() === '')
    {
        setTinyText(getText('fieldCannotBeEmpty'));
        return;
    }

    value = value.trim();

    const regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if(regex.test(value))
    {
        //Es válido
        console.log('El email es válido');
        email = value;
        step++;
        displayNextStep();
    }
    else
    {
        setTinyText(getText('invalidEmail'));
    }
}

function displayUsername()
{
    if(username !== undefined)
    {
        comprobeUserName();
        return;
    }

    text.innerText = getText('username');
    setTinyText();
    clearInputField('text', email.split('@')[0]);
    backButton.hidden = false;
    changeEmailButton.hidden = true;
    inputField.hidden = false;
    nextButton.hidden = false;
}

function comprobeUserName()
{
    let value;
    if(username === undefined) value = inputField.value.trim();
    else value = username;

    if(value === '' || value === null)
    {
        username = email.split('@')[0];
    }
    else if(value.length > 30)
    {
        setTinyText(getText('newNote_tooLongName_title'));
        return;
    }
    else username = value.trim();

    step++;
    displayNextStep();
}

function displayPassword()
{
    if(password !== undefined)
    {
        comprobePassword();
        return;
    }

    text.innerText = getText('password');
    setTinyText();
    clearInputField('password', getText('hyperSecurePassword'));
    backButton.hidden = false;
    changeEmailButton.hidden = true;
    inputField.hidden = false;
    nextButton.hidden = false;
}

function comprobePassword()
{    
    let value;
    if(password === undefined) value = inputField.value;
    else
    {
        value = password;
    }

    if(value.trim() === '' || value === null)
    {
        setTinyText(getText('fieldCannotBeEmpty'));
        return;
    }
    else if(value.length < 8)
    {
        setTinyText(getText('passwordMustContains'));
        return;
    }
    else if(value.length > 20)
    {
        setTinyText(getText('tooLongPassword'));
        return;
    }

    const capitalsRegex = new RegExp('[A-Z]+');
    const notCapitalsRegex = new RegExp('[a-z]+');
    const numbersRegex = new RegExp('[0-9]+');

    const containsCapitals = capitalsRegex.test(value);
    const containsNotCapitals = notCapitalsRegex.test(value);
    const containsNumbers = numbersRegex.test(value);

    console.log('containsCapitals', containsCapitals);
    console.log('containsNotCapitals', containsNotCapitals)
    console.log('containsNumbers', containsNumbers);
    console.log(containsCapitals && containsNotCapitals && containsNumbers);

    if(!containsCapitals || !containsNotCapitals || !containsNumbers)
    {
        setTinyText(getText('passwordMustContains'));
        return;
    }

    password = value;
    step++;
    displayNextStep();
}

function displayConfirmPassword()
{
    if(comprobedPassword !== undefined)
    {
        comprobeConfirmPassword();
        return;
    }

    text.innerText = getText('confirmPassword');
    setTinyText();
    clearInputField('password', getText('typeItAgain'));
    backButton.hidden = false;
    changeEmailButton.hidden = true;
    inputField.hidden = false;
    nextButton.hidden = false;
}

function comprobeConfirmPassword()
{
    let value;
    if(comprobedPassword === undefined) value = inputField.value;
    else value = comprobedPassword;

    if(value.trim() === '' || value === null)
    {
        setTinyText(getText('typeTheSamePasswordAsBefore'));
    }
    else if(value === password)
    {
        comprobedPassword = password;
        step++;
        displayNextStep();
    }
    else
    {
        setTinyText(getText('passwordsDontMatch'));
    }
}

async function displayEmailCode()
{
    if([email, username, password].includes(undefined) || [email, username, password].includes(undefined))
    {
        text.innerText = getText('oneFieldInvalid');
        setTinyText(getText('startOverAgain'));
        email = undefined;
        password = undefined;
        username = undefined;
        step = 0;
        setTimeout(function()
        {
            displayNextStep();
        }, 2000);
    }

    inputField.hidden = true;
    changeEmailButton.hidden = true;
    nextButton.hidden = true;
    backButton.hidden = true;
    text.innerText = getText('waitAMoment');
    setTinyText();

    try
    {
        const response = await axios.post(`${path}/createAccountEmailCode`, {email, password, username, operation: 'newAccount'});
        console.log(response);
    
        if(response.data.error === undefined && response.data.emailSent)
        {
            text.innerText = getText('checkYourEmail');
            setTinyText(`${getText('codeWeSent')} ${email}`);
            clearInputField('text', 'A1B2C');
            inputField.hidden = false;
            changeEmailButton.hidden = false;
            nextButton.hidden = false;
            backButton.hidden = false;
        }
        else if(response.data.error === 'duplicatedEmail')
        {
            text.innerText = getText('emailDuplicated');
            email = undefined;
            password = undefined;
            username = undefined;
            step = 0;
            changeEmailButton.hidden = false;
        }
        else if(response.data.error === 'invalidFields')
        {
            text.innerText = getText('oneFieldInvalid');
            setTinyText(getText('startOverAgain'));
            email = undefined;
            password = undefined;
            username = undefined;
            step = 0;
            setTimeout(function()
            {
                displayNextStep();
            }, 2000);
        }
        else
        {
            text.innerText = getText('somethingWentWrong');
            setTinyText(response.data.error);
            setTimeout(function()
            {
                location.reload();
            }, 2000);
            return;
        }
    }
    catch
    {
        text.innerText = getText('ups');
        setTinyText(getText('serverDown'));
        localStorage.setItem('_email', email);
        localStorage.setItem('_password', password);
        localStorage.setItem('_username', username);
    }
}

changeEmailButton.addEventListener('click', function()
{
    step = 0;
    email = undefined;
    displayNextStep();
    changeEmailButton.hidden = true;
});

async function comprobeEmailCode()
{
    const code = inputField.value.toUpperCase();

    if(code.trim() === '' || code.length !== 5)
    {
        setTinyText(getText('introduceAValidCode'));
        return;
    }

    inputField.hidden = true;
    changeEmailButton.hidden = true;
    nextButton.hidden = true;
    backButton.hidden = true;
    text.innerText = getText('waitAMoment');
    setTinyText();

    try
    {
        const response = await axios.post(`${path}/createNewAccount`,{code});
        if(response.data.error === undefined)
        {
            //Cuenta creada
            step++;
            nextButton.hidden = false;
            text.innerText = getText('accountCreated');
            setTinyText(getText('accountCreated2'));
        }
        else if(response.data.error === 'invalidCode')
        {
            //Código no válido
            inputField.hidden = false;
            changeEmailButton.hidden = false;
            nextButton.hidden = false;
            text.innerText = getText('introduceAValidCode');
            setTinyText(getText('introduceAValidCode2'));
        }
        else
        {
            //Mostrar error desconocido
            text.innerText = getText('somethingWentWrong');
            setTinyText(response.data.error);
        }

        localStorage.removeItem('_email');
        localStorage.removeItem('_username');
        localStorage.removeItem('_password');
    }
    catch
    {
        //Se cayó el server
        setTinyText(getText('serverDown'));
        inputField.hidden = false;
        nextButton.hidden = false;
        changeEmailButton.hidden = false;
    }
}
