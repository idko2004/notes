document.getElementById('toDeleteConfigurationButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'deleteConfiguration';

    animatedTransition(mainMenu, deleteConfigurationMenu);
});

document.getElementById('deleteConfigurationCancel').addEventListener('click', function()
{
    if(actualMenu !== 'deleteConfiguration') return;

    actualMenu = 'main';
    animatedTransition(deleteConfigurationMenu, mainMenu);
});

document.getElementById('deleteConfigurationConfirm').addEventListener('click', function()
{
    if(actualMenu !== 'deleteConfiguration') return;

    animatedTransition(deleteConfigurationMenu, undefined, function()
    {
        deleteManageAccountRelatedCookies();
        location.href = 'index.html#deleteconfig';
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('toDeleteAllButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'deleteAllLocal';

    animatedTransition(mainMenu, deleteAllMenu);
});

document.getElementById('deleteAllCancel').addEventListener('click', function()
{
    if(actualMenu !== 'deleteAllLocal') return;

    actualMenu = 'main';

    animatedTransition(deleteAllMenu, mainMenu);
});

document.getElementById('deleteAllConfirm').addEventListener('click', function()
{
    if(actualMenu !== 'deleteAllLocal') return;

    animatedTransition(deleteAllMenu, undefined, function()
    {
        deleteManageAccountRelatedCookies();
        location.href = 'index.html#deleteall';
    });
});