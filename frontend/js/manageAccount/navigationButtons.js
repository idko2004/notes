
function changeHashMenu(menuName)
{
    hashReplaceValue('menu', menuName);
}

window.onhashchange = function()
{
    const menu = hashEquals('menu');
    if(menu === undefined) backToIndex(); // Volver al index porque no hay menu
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
                case 'spellcheck':
                    updateSpellcheckText();
                    break;
                    
                case 'changeData':
                    updateDataMenuPlaceholders();
                    break;

                case 'deleteAccount':
                    updateDeleteAccountPlaceholders();
                    break;
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
