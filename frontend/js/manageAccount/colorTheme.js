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
            callback: function()
            {
                closeWindow(colorTheme_goBack)
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
            callback: function()
            {
                closeWindow(colorTheme_goBack)
            }
        }
    });
});

function colorTheme_goBack()
{
    if(actualMenu !== 'colorTheme') return;

    let endAnimationCallback = function(e)
    {
        if(e.animationName !== 'closeMenuAnimation') return;

        colorThemeMenu.hidden = true;
        mainMenu.hidden = false;

        mainMenu.classList.remove('closeMenu');
        mainMenu.classList.add('openMenu');

        actualMenu = 'main';
        window.scrollTo(0,0);
        colorThemeMenu.removeEventListener('animationend', endAnimationCallback);
    }

    colorThemeMenu.classList.remove('openMenu');
    colorThemeMenu.classList.add('closeMenu');
    colorThemeMenu.addEventListener('animationend', endAnimationCallback);
}
