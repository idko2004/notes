newNote.addEventListener('click',function()
{
    newNoteField.hidden = !newNoteField.hidden;

    if(!newNoteField.hidden) newNote.innerText = 'x';
    else
    {
        newNote.innerText = '+';
    }
});

newNoteButton.addEventListener('click',function()
{
    let noteName = newNoteName.value.trim();
    if(noteName === '')
    {
        //TODO: implemenetar bien esta cosa
        alert('La nota no puede tener un nombre vacío.');
        return;
    }
    if(getSpecificCookie(noteName) !== null)
    {
        alert('Ya existe una nota con ese nombre.');
        return;
    }

    newNoteField.hidden = true;
    newNote.innerText = '+';
    createListButton(noteName);
    saveCookie(noteName,'');
    loadNote(noteName);
    youDontHaveNotes();
});