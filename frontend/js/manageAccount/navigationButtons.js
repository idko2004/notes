// Esto funciona más o menos, pero creo que no lo voy a incluir debido a las complicaciones que va a traer,
// Además, tampoco es que sea necesario, creo que voy a poner un botón normal y ya.
// Esto servía para que la página vaya al menú anterior si le dabas a ir hacia atrás en el navegador,
// Pero podría abrir puertas a demasiados problemas, por eso elijo no implementarlo.

let menuArray = [];
let lastMenuArrayIndex;

// Llamar al cambiar de pantalla pasandole de argumento el nuevo actualMenu
function addToMenuArray(menuName)
{
    if(typeof menuName !== 'string')
    {
        console.error('string expected');
        return;
    }

    let i;
    const menuindex = hashEquals('menuindex');
    if(menuArray.length === 0 || menuindex === undefined) i = 0;
    else
    {
        i = parseInt(menuindex);
        if(isNaN(i)) return;
    }
    i++;

    lastMenuArrayIndex = i;
    menuArray[i-1] = menuName;
    hashReplaceValue('menuindex', i);
    console.log(menuArray);
}

// Cuando el hash cambia, una situación en la que cambia es dándole al botón de atrás.
window.onhashchange = function()
{
    let menuindex = parseInt(hashEquals('menuindex'));
    if(isNaN(menuindex))
    {
        console.error('menuindex en hash es NaN');
        return;
    }
    if(lastMenuArrayIndex === menuindex) return;

    //alert(`menuindex: ${menuindex}\nlastMenuArrayIndex: ${lastMenuArrayIndex}\nmenuArray element: ${menuArray[menuindex-1]}`)

    console.log('menuindex: ', menuindex);
    console.log('lastMenuArrayIndex: ', lastMenuArrayIndex);
    console.log('menuArray element:', menuArray[menuindex - 1]);

    navButtonsChangeMenu(menuArray[menuindex-1]);
}

function navButtonsChangeMenu(menuName)
{
    if(typeof menuName !== 'string')
    {
        console.error('string expected');
        return;
    }

    const currentMenu = getElementByMenuName(actualMenu);
    const targetMenu = getElementByMenuName(menuName);

    animatedTransition(currentMenu, targetMenu);
    actualMenu = menuName;
}