function hashContains(element)
{
    let h = location.hash;
    h = h.replace('#','');
    let hSplit = h.split(';');

    if(hSplit.includes(element)) return true;
    else return false;
}

function hashEquals(element)
{
    let h = location.hash;
    h = h.replace('#','');
    let hSplit = h.split(';');

    for(let i = 0; i < hSplit.length; i++)
    {
        let hSplitSplitted = hSplit[i].split('=');
        if(hSplitSplitted[0] === element) return hSplitSplitted[1];
    }
    return undefined;
}

function hashDelete(element)
{
    let h = location.hash.replace('#', '');
    let hSplit = h.split(';');

    //Borrar el elemento
    for(let i = 0; i < hSplit.length; i++)
    {
        if(hSplit[i].includes('='))
        {
            let hSplitSplitted = hSplit[i].split('=');
            if(hSplitSplitted[0] === element)
            {
                hSplit[i] = null;
                break;
            }
        }
        else
        {
            if(hSplit[i] === element)
            {
                hSplit[i] = null;
                break;
            }
        }
    }

    //Reconstruir el hash
    let newHash = '#';
    for(let i = 0; i < hSplit.length; i++)
    {
        if(hSplit[i] !== null) newHash += `${hSplit[i]};`;
    }

    newHash = newHash.slice(0, -1);
    location.hash = newHash;
}

function hashAdd(element)
{
    if(location.hash === '#' || location.hash === '') location.hash = element;
    else location.hash += `;${element}`;
}

function hashReplaceValue(element, newValue)
{
    let h = location.hash.replace('#', '');
    let hSplit = h.split(';');

    //Encontrar el elemento de la misma forma que con hashDelete pero en vez de borrar reemplazando el valor
    let found = false;
    for(let i = 0; i < hSplit.length; i++)
    {
        let hSplitSplitted = hSplit[i].split('=');
        if(hSplitSplitted[0] === element)
        {
            hSplit[i] = `${element}=${newValue}`;
            found = true;
            break;
        }
    }

    //En caso de que el elemento no exista, se añade
    if(!found) hSplit.push(`${element}=${newValue}`);

    //Reconstruir el hash
    let newHash = '#';
    for(let i = 0; i < hSplit.length; i++)
    {
        newHash += `${hSplit[i]};`;
    }

    newHash = newHash.slice(0, -1);
    location.hash = newHash;
}