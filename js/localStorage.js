function getKeyNames()
{
    let keys = [];
    let i = 0;
    while(true)
    {
        let key = localStorage.key(i);

        if(key === null) break;
        keys.push(key);
        
        i++;
    }

    console.log('Lista de keys', keys);
    return keys;
}

function deleteKey(name)
{
    localStorage.removeItem(name);
    console.log('item borrado', name);
}

function saveKey(name, value)
{
    localStorage.setItem(name, value);
    console.log('item guardado', name);
}

function getKey(name)
{
    return localStorage.getItem(name);
}