const path = 'http://localhost:3000';

let step = 0;

let username;
let email;
let password;
let comprobedPassword;

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

//Step 0 = email
//Step 1 = username
//Step 2 = password
//Step 3 = comprobe password
//Step 4 = code

nextButton.addEventListener('click', comprobeThisStep);
inputField.addEventListener('keydown', function(e)
{
    if(e.key === 'Enter') comprobeThisStep();
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
        const ping = await axios.get(`${path}/ping`);
        if(ping.data === 'pong!') displayNextStep();
    }
    catch
    {
        text.innerText = 'Vaya...';
        setTinyText('Parece que el servidor se ha caído.\nPrueba a intentarlo de nuevo en un rato.');
        reloadButton.hidden = false;
    }
}

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
            text.innerText = 'Ha ocurrido un error';
            setTinyText('La página se recargará');
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

    text.innerText = 'Correo electrónico';
    setTinyText();
    clearInputField('text', 'alguien@email.com');
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
        setTinyText('El campo no puede estar vacío.');
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
        setTinyText('El correo electrónico no es válido.');
    }
}

function displayUsername()
{
    if(username !== undefined)
    {
        comprobeUserName();
        return;
    }

    text.innerText = 'Nombre de usuario';
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
        setTinyText('El nombre es demasiado largo.');
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

    text.innerText = 'Contraseña';
    setTinyText();
    clearInputField('password', 'Una contraseña híper segura');
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
        setTinyText('La contraseña no puede estar vacía.');
        return;
    }
    else if(value.length < 8)
    {
        setTinyText('La contraseña debe contener mayúsculas, minúsculas, números y debe tener 8 o más caracteres');
        return;
    }
    else if(value.length > 20)
    {
        setTinyText('La contraseña es demasiado larga. (Máximo 20 caracteres)');
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
        setTinyText('La contraseña debe contener mayúsculas, minúsculas y números');
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

    text.innerText = 'Confirmar contraseña';
    setTinyText();
    clearInputField('password', 'Vuelve a escribirlo');
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
        setTinyText('Debe escribir la misma contraseña que escribió antes.');
    }
    else if(value === password)
    {
        comprobedPassword = password;
        step++;
        displayNextStep();
    }
    else
    {
        setTinyText('Las contraseñas no coinciden.\nAsegúrate de poner la misma contraseña que en el campo anterior.');
    }
}

async function displayEmailCode()
{
    if(email === undefined || username === undefined || password === undefined || email === null || username === null || password === null)
    {
        text.innerText = 'Uno de los campos no es válido.';
        setTinyText('Tendremos que volver a empezar el proceso.');
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
    text.innerText = 'Por favor, espere';
    setTinyText();

    try
    {
        const response = await axios.post(`${path}/createAccountEmailCode`, {email, password, username, operation: 'newAccount'});
        console.log(response);
    
        if(response.data.error === undefined && response.data.emailSent)
        {
            text.innerText = 'Revisa tu correo';
            setTinyText(`Introduce el código que enviamos a ${email}`);
            clearInputField('text', 'A1B2C');
            inputField.hidden = false;
            changeEmailButton.hidden = false;
            nextButton.hidden = false;
            backButton.hidden = false;
        }
        else if(response.data.error === 'duplicatedEmail')
        {
            text.innerText = 'Este correo ya tiene una cuenta';
            email = undefined;
            password = undefined;
            username = undefined;
            step = 0;
            changeEmailButton.hidden = false;
        }
        else if(response.data.error === 'invalidFields')
        {
            text.innerText = 'Uno de los campos no es válido.';
            setTinyText('Tendremos que volver a empezar el proceso.');
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
            text.innerText = 'Error inesperado';
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
        text.innerText = 'El servidor no responde';
        setTinyText('Su información será guardada en caso de que quiera cerrar la página para volver a intentarlo luego, solo tiene que recargar la página');
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
        setTinyText('Introduce un código válido.');
        return;
    }

    inputField.hidden = true;
    changeEmailButton.hidden = true;
    nextButton.hidden = true;
    backButton.hidden = true;
    text.innerText = 'Por favor, espere';
    setTinyText();

    try
    {
        const response = await axios.post(`${path}/createNewAccount`,{code});
        if(response.data.error === undefined)
        {
            //Cuenta creada
            step++;
            nextButton.hidden = false;
            text.innerText = '¡Cuenta creada!';
            setTinyText('Vuelve a la página principal para inciar sesión en tu nueva cuenta.');
        }
        else if(response.data.error === 'invalidCode')
        {
            //Código no válido
            inputField.hidden = false;
            changeEmailButton.hidden = false;
            nextButton.hidden = false;
            text.innerText = 'Este código no es válido';
            setTinyText(`Introduce el código que enviamos al correo ${email}`);
        }
        else
        {
            //Mostrar error desconocido
            text.innerText = 'Ha ocurrido un error';
            setTinyText(response.data.error);
        }

        localStorage.removeItem('_email');
        localStorage.removeItem('_username');
        localStorage.removeItem('_password');
    }
    catch
    {
        //Se cayó el server
        setTinyText('El servidor no responde.');
        inputField.hidden = false;
        nextButton.hidden = false;
        changeEmailButton.hidden = false;
    }
}