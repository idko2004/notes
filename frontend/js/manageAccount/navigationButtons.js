
function changeHashMenu(menuName)
{
    hashReplaceValue('menu', menuName);
}

window.onhashchange = function()
{
    const menu = hashEquals('menu');
    if(menu === undefined) // Volver al index porque no hay menu
    {
        alert('Go back to index');
        backToIndex();
    }
    else if(menu !== actualMenu) // El menu no ha sido cambiado dentro de la pagina
    {
        // Moverse hacia ese menu si es que esta permitido.
        console.log('Menu en hash', menu);

        const bannedMenus =
        [
            'changeDataEmailCode',
            'changeDataComprobingCode',
            'deleteAccountEmailCode'
        ];

        const bannedLocalMenus =
        [
            'localCopy',
            'changeData',
            'changeDataEmailCode',
            'changeDataComprobingCode',
            'logOutInAll',
            'deleteAccount',
            'deleteAccountEmailCode'
        ];

        if(!bannedMenus.includes(menu) && (!isLocalMode || !bannedLocalMenus.includes(menu))) // El menu es permitido
        {
            const currentMenu = getElementByMenuName(actualMenu);
            const targetMenu = getElementByMenuName(menu);

            if(targetMenu === undefined)
            {
                defaultMenu();
                return;
            }

            specialCases(menu);
            
            actualMenu = menu;
            animatedTransition(currentMenu, targetMenu);
        }
        else defaultMenu();

        function specialCases(menuName)
        {
            switch(menuName)
            {
                //TODO: poner los casos especiales, como spellcheck o el menú de actualizar datos
            }
        }

        function defaultMenu()
        {
            console.log("Can't go there");
            const currentMenu = getElementByMenuName(actualMenu);
            const targetMenu = getElementByMenuName('main');
            
            if(currentMenu !== undefined) animatedTransition(currentMenu, targetMenu);
            else
            {
                // Borrar todas las clases referentes a las animaciones
                const openMenuClass = document.getElementsByClassName('openMenu');
                for(let i = 0; i < openMenuClass.length; i++)
                {
                    openMenuClass[i].hidden = true;
                    openMenuClass[i].classList.remove('openMenu');
                }
                const closeMenuClass = document.getElementsByClassName('closeMenu');
                for(let i = 0; i < closeMenuClass.length; i++)
                {
                    closeMenuClass[i].classList.remove('closeMenu');
                }

                // Hacer visible el menú que queremos mostrar (main)
                targetMenu.classList.add('openMenu');
                targetMenu.hidden = false;
            }

            actualMenu = 'main';
            changeHashMenu('main');
        }
    }
}

/*
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
*/