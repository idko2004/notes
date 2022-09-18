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

document.getElementById('deleteConfigurationConfirm').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteConfiguration') return;

    await animatedTransition(deleteConfigurationMenu);
    deleteManageAccountRelatedCookies();
    location.href = 'index.html#deleteconfig';
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

document.getElementById('deleteAllConfirm').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteAllLocal') return;

    await animatedTransition(deleteAllMenu);
    deleteManageAccountRelatedCookies();
    location.href = 'index.html#deleteall';
});