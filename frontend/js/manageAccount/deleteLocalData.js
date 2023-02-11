document.getElementById('toDeleteConfigurationButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'deleteConfiguration';
    changeHashMenu('deleteConfiguration');

    animatedTransition(mainMenu, deleteConfigurationMenu);
});

document.getElementById('deleteConfigurationCancel').addEventListener('click', function()
{
    if(actualMenu !== 'deleteConfiguration') return;

    actualMenu = 'main';
    changeHashMenu('main');
    animatedTransition(deleteConfigurationMenu, mainMenu);
});

document.getElementById('deleteConfigurationConfirm').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteConfiguration') return;

    await animatedTransition(deleteConfigurationMenu);
    deleteAllCookies();
    location.href = 'index.html#deleteconfig';
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('toDeleteAllButton').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'deleteAllLocal';
    changeHashMenu('deleteAllLocal');

    animatedTransition(mainMenu, deleteAllMenu);
});

document.getElementById('deleteAllCancel').addEventListener('click', function()
{
    if(actualMenu !== 'deleteAllLocal') return;

    actualMenu = 'main';
    changeHashMenu('main');

    animatedTransition(deleteAllMenu, mainMenu);
});

document.getElementById('deleteAllConfirm').addEventListener('click', async function()
{
    if(actualMenu !== 'deleteAllLocal') return;

    await animatedTransition(deleteAllMenu);
    deleteAllCookies();
    location.href = 'index.html#deleteall';
});