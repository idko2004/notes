document.getElementById('toChangeColorTheme').addEventListener('click', function()
{
    if(actualMenu !== 'main') return;

    actualMenu = 'colorTheme';
    changeHashMenu('colorTheme');

    animatedTransition(mainMenu, colorThemeMenu);
});

document.getElementById('changeColorTheme_cancel').addEventListener('click', colorTheme_goBack);

document.getElementById('changeColorTheme_light').addEventListener('click', function()
{
    if(actualMenu !== 'colorTheme') return;

    thingsChanged.colorTheme = 'light';

    floatingWindow(
    {
        title: getText('lightThemeWillBeApplied'),
        text: getText('saveToApplyTheme'),
        button:
        {
            text: getText('ok'),
            callback: async function()
            {
                await closeWindow();
                colorTheme_goBack();
            }
        }
    });
});

document.getElementById('changeColorTheme_dark').addEventListener('click', function()
{
    if(actualMenu !== 'colorTheme') return;

    thingsChanged.colorTheme = 'dark';

    floatingWindow(
    {
        title: getText('darkThemeWillBeApplied'),
        text: getText('saveToApplyTheme'),
        button:
        {
            text: getText('ok'),
            callback: async function()
            {
                await closeWindow();
                colorTheme_goBack();
            }
        }
    });
});

document.getElementById('changeColorTheme_krad').addEventListener('click', function()
{
    if(actualMenu !== 'colorTheme') return;

    thingsChanged.colorTheme = 'krad';

    floatingWindow(
    {
        title: getText('kradThemeWillBeApplied'),
        text: getText('saveToApplyTheme'),
        button:
        {
            text: getText('ok'),
            callback: async function()
            {
                await closeWindow();
                colorTheme_goBack();
            }
        }
    });
});

function colorTheme_goBack()
{
    if(actualMenu !== 'colorTheme') return;

    actualMenu = 'main';
    changeHashMenu('main');

    animatedTransition(colorThemeMenu, mainMenu);
}
