textArea.value = '';
textArea.disabled = true;

function loadNote(name)
{
    console.log('Cargar nota',name);
    let noteContent = getSpecificCookie(name);

    noteName.innerText = name;
    textArea.value = noteContent;
    textArea.disabled = false;
    topBarButtons.hidden = false;

    showTheNoteInSmallScreen(true);
}

//Botón de guardar nota
document.getElementById('saveButton').addEventListener('click',(e) =>
{
    saveNote();
    sayThings.innerText = '(Guardado).';
    setTimeout(() =>
    {
        sayThings.innerText = '';
    },1000);
});

function saveNote()
{
    let name = noteName.innerText;
    let value = textArea.value;
    saveCookie(name, value);
}

//Botón de borrar nota
document.getElementById('deleteButton').addEventListener('click',(e) =>
{
    let name = noteName.innerText;

    let confirmation = confirm(`¿Quieres borrar la nota ${name}?`);
    if(!confirmation) return;

    deleteCookie(name);

    textArea.value = '';
    textArea.disabled = true;

    noteName.innerText = 'Haz click sobre una nota.'
    topBarButtons.hidden = true;

    deleteListButton(name);
    youDontHaveNotes();
});