window.onresize = resizeTwice;

resizeTwice();

function resizeTwice()
{
    resizeElements();
    setTimeout(resizeElements, 50);
}

function resizeElements()
{
    hideLeftBar();
    resizeCreateNewNoteField();
    resizeTextArea();

    function resizeTextArea()
    {
        textArea.style.width = topBar.offsetWidth;
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
        }
    }

    function resizeCreateNewNoteField()
    {
        if(!leftBar.hidden) newNoteField.style.width = leftBarTitle.offsetWidth;
    }
}


showNotesListButton.addEventListener('click', () =>
{
    showTheNoteInSmallScreen(false);
    saveNote();
});

function showTheNoteInSmallScreen(show)
{
    showTheNote = show;
    resizeTwice();
}