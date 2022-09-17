window.onresize = resizeTwice;

resizeTwice();

function resizeTwice()
{
    resizeElements();
    setTimeout(resizeElements, 50);
    //setTimeout(resizeElements, 200);
}

function resizeElements()
{
    hideLeftBar();
    resizeTextArea();

    function resizeTextArea()
    {
        if(!noteSection.hidden)
        {
            console.log(noteSection.hidden, topBar.offsetWidth);
            textArea.style.width = topBar.offsetWidth;
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