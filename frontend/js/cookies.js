function readCookies()
{
    return document.cookie;
}

function getCookiesNames()
{
    let cookies = readCookies().split(';');
    let cookiesNames = [];
    for(let i = 0; i < cookies.length; i++)
    {
        cookiesNames.push(cookies[i].trim().split('=')[0]);
    }
    return cookiesNames;
}

function getSpecificCookie(name)
{
    let cookies = readCookies().split(';');
    for(let i = 0; i < cookies.length; i++)
    {
        let cookieSplit = cookies[i].split('=');
        cookieSplit[0] = cookieSplit[0].trim();
        if(cookieSplit[0] === name) return cookieSplit[1];
    }
    return null;
}

function saveCookie(name, value)
{
    document.cookie = `${name}=${value};SameSite=strict`;
    console.log('cookie guardada:', name, value);
}

function deleteCookie(name)
{
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=strict`
    console.log('cookie borrada',name);
    console.log(document.cookie);
}

function deleteAllCookies()
{
    getCookiesNames().forEach(function(e)
    {
        deleteCookie(e);
    });
}