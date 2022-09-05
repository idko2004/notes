document.getElementById('deleteConfigurationCancel').addEventListener('click', function()
{
    if(actualMenu !== 'deleteConfiguration') return;

    let endAnimationCallback = function (e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        deleteConfigurationMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0, 0);
        deleteConfigurationMenu.removeEventListener('animationend', endAnimationCallback);
    }

    deleteConfigurationMenu.classList.remove('openMenu');
    deleteConfigurationMenu.classList.add('closeMenu');
    deleteConfigurationMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('deleteConfigurationConfirm').addEventListener('click', function()
{
    if(actualMenu !== 'deleteConfiguration') return;

    let endAnimationCallback = function (e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        deleteConfigurationMenu.hidden = true;

        deleteManageAccountRelatedCookies();
        location.href = 'index.html#deleteconfig';
    }

    deleteConfigurationMenu.classList.remove('openMenu');
    deleteConfigurationMenu.classList.add('closeMenu');
    deleteConfigurationMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('deleteAllCancel').addEventListener('click', function()
{
    if(actualMenu !== 'deleteAllLocal') return;

    let endAnimationCallback = function (e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        deleteAllMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0, 0);
        deleteAllMenu.removeEventListener('animationend', endAnimationCallback);
    }

    deleteAllMenu.classList.remove('openMenu');
    deleteAllMenu.classList.add('closeMenu');
    deleteAllMenu.addEventListener('animationend', endAnimationCallback);
});

document.getElementById('deleteAllConfirm').addEventListener('click', function()
{
    if(actualMenu !== 'deleteAllLocal') return;

    let endAnimationCallback = function (e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        deleteAllMenu.hidden = true;

        deleteManageAccountRelatedCookies();
        location.href = 'index.html#deleteall';
    }

    deleteAllMenu.classList.remove('openMenu');
    deleteAllMenu.classList.add('closeMenu');
    deleteAllMenu.addEventListener('animationend', endAnimationCallback);
});