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
    let h = location.hash;

    if(h.includes(`${element}=`))
    {
        const hSplit = h.split(';');
        for(let i = 0; i < hSplit.length; i++)
        {
            const hSplitSplitted = hSplit[i].split('=');
            if(hSplitSplitted[0] === element || hSplitSplitted[0] === `#${element}`)
            {
                if(h.includes(`;${hSplit[i]}`)) location.hash = h.replace(`;${hSplit[i]}`, '');
                else if(h.includes(`#${hSplit[i]};`)) location.hash = h.replace(`${hSplit[i]};`, '');
                else location.hash = h.replace(hSplit[i], '');
                break;
            }
        }
    }
    else if(h.includes(`;${element}`)) location.hash = h.replace(`;${element}`, '');
    else if(h.includes(`#${element};`)) location.hash = h.replace(`${element};`, '');
    else if(h.includes(element)) location.hash = h.replace(element, '');
}

function hashAdd(element)
{
    if(location.hash === '#' || location.hash === '') location.hash = element;
    else location.hash += `;${element}`;
}