async function test()
{
    const call = await axios.get('http://localhost:3000/test',
    {
        'id': 11037
    });

    console.log(call);

    /*const testCall = await fetch('http://localhost:3000/test',
    {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        headers:
        {
            'Content-Type': 'application/json',
            'id': 11037
        },
    });
    
    console.log(testCall);*/
}

//test();