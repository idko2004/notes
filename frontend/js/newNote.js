newNote.addEventListener('click',function()
{
    if(!canInteract) return;

    newNoteField.hidden = !newNoteField.hidden;

    if(!newNoteField.hidden) newNote.innerText = 'x';
    else
    {
        newNote.innerText = '+';
    }
});

newNoteButton.addEventListener('click', () =>
{
    if(!canInteract) return;
    createNewNote();
});

newNoteName.addEventListener('keydown', function(e)
{
    if(!canInteract) return;

    if(e.key === 'Enter') createNewNote();
    if(e.key === 'Escape')
    {
        newNoteField.hidden = true;
        newNote.innerText = '+';
    }
});

function createNewNote()
{
    let noteName = newNoteName.value.trim();
    newNoteName.value = '';
    if(!newNoteNameIsValid(noteName)) return;

    newNoteField.hidden = true;
    newNote.innerText = '+';

    createListButton(noteName);

    saveKey(noteName,'');
    loadNote(noteName);

    youDontHaveNotes();

    selectedNote(undefined, noteName);
}

function newNoteNameIsValid(noteName)
{
    closeWindow(); //Por si haya una ventana abierta

    if(noteName === '')
    {
        floatingWindow
        ({
            title: 'Escribe un nombre',
            text: 'La nota no puede tener un nombre vacío.',
            button:
            {
                text: 'Aceptar',
                callback: () => {closeWindow()}
            }
        });
        return false;
    }
    if(noteName.startsWith('_'))
    {
        floatingWindow
        ({
            title: '_Error',
            text: 'El nombre de una nota no puede empezar con "_"',
            button:
            {
                text: 'Aceptar',
                callback: () => {closeWindow()}
            }
        });
        return false;
    }
    if(noteName.length > 30)
    {
        floatingWindow
        ({
            title: 'Acorta el nombre',
            text: 'El nombre de la nota es demasiado largo.',
            button:
            {
                text: 'Aceptar',
                callback: () => {closeWindow()}
            }
        });
        return false;
    }
    if(getKey(noteName) !== null)
    {
        floatingWindow
        ({
            title: 'Nota duplicada',
            text: `Ya existe una nota con el nombre '${noteName}'`,
            button:
            {
                text: 'Aceptar',
                callback: () => {closeWindow()}
            }
        });
        return false;
    }

    return true;
}