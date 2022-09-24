window.onresize = resizeTwice;

resizeTwice();

function resizeTwice()
{
    resizeElements();
    setTimeout(resizeElements, 50);
    //setTimeout(resizeElements, 200);
}

//la única forma que encontré de hacer, joder como te odio css
function resizeElements()
{
    hideLeftBar();
    resizeLeftBar();
    resizeTextArea();

    function resizeTextArea()
    {
        if(!noteSection.hidden)
        {
            //Horizontal
            //Obtener el espacio que ocupa topbar
            const topBarWidth = parseFloat(window.getComputedStyle(topBar).getPropertyValue('width'));
            const topBarPadding = parseFloat(window.getComputedStyle(topBar).getPropertyValue('padding'));
            const topBarMargin = parseFloat(window.getComputedStyle(topBar).getPropertyValue('margin'));

            //Resimensionar textarea
            textArea.style.width = topBarWidth + (topBarPadding * 2);
            
            //Vertical
            //Obtener el tamaño de leftbar y los que faltan de topbar
            const leftBarHeight = parseFloat(window.getComputedStyle(leftBar).getPropertyValue('height'));
            const topBarHeight = parseFloat(window.getComputedStyle(topBar).getPropertyValue('height'))

            textArea.style.height = leftBarHeight - topBarMargin - topBarPadding - topBarHeight;
        }
    }

    function resizeLeftBar()
    {
        if(!leftBar.hidden)
        {
            //Obtener el espacio que ocupa la barra de arriba
            const navHeight = parseFloat(window.getComputedStyle(nav).getPropertyValue('height'));
            const navPadding = parseFloat(window.getComputedStyle(nav).getPropertyValue('padding'));
            const navMargin = parseFloat(window.getComputedStyle(nav).getPropertyValue('height'));

            //Redimensionar leftbar
            const leftBarHeight = window.innerHeight - (navHeight + (navPadding * 2) + (navMargin * 2));
            leftBar.style.height = leftBarHeight;

            //obtener el padding de leftbar
            const leftBarPadding = parseFloat(window.getComputedStyle(leftBar).getPropertyValue('padding'));

            //obtener el tamaño del botón para crear notas
            const buttonHeight = parseFloat(window.getComputedStyle(newNote).getPropertyValue('height'));
            const buttonPadding = parseFloat(window.getComputedStyle(newNote).getPropertyValue('padding'));

            //Cambiar el tamaño de notesList (el elemento dentro de leftbar que contiene la lista de notas)
            notesList.style.maxHeight = leftBarHeight - ((leftBarPadding * 2) + buttonHeight + (buttonPadding * 2));
        }
    }

    function hideLeftBar()
    {
        const n = 700;
        if(window.innerWidth >= n)
        {
            leftBar.hidden = false;
            noteSection.hidden = false;
            leftToTheNoteNameButtons.hidden = true;
            showTheNote = true;
            leftBar.classList.remove('leftBarEntireWidth');
        }
        else
        {
            //Para saber si una nota está activa comprobamos si los botónes están escondidos o no.
            if(topBarButtons.hidden)
            {
                leftBar.hidden = false;
                noteSection.hidden = true;
            }
            else
            {
                if(showTheNote)
                {
                    leftBar.hidden = true;
                    noteSection.hidden = false;
                }
                else
                {
                    leftBar.hidden = false;
                    noteSection.hidden = true;
                }
            }
            leftToTheNoteNameButtons.hidden = false;
            leftBar.classList.add('leftBarEntireWidth');
        }
    }
}


showNotesListButton.addEventListener('click', () =>
{
    if(!canInteract) return;
    if(theActualThing !== 'note') return;

    saveNote();
    showTheNoteInSmallScreen(false);
});

function showTheNoteInSmallScreen(show)
{
    showTheNote = show;
    resizeTwice(); //Hide left bar se encarga de esto.
}