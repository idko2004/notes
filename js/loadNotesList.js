loadNotesList();

function loadNotesList()
{
    console.log('Cargando lista de notas');
    let notesNames = getCookiesNames();
    
    for(let i = 0; i < notesNames.length; i++)
    {
        if(notesNames[i] === '') continue;
        if(notesNames[i] === '_test') continue;
        createListButton(notesNames[i]);
    }
    
    youDontHaveNotes();

    console.log('Lista de notas cargada');
}

function createListButton(noteName)
{
    let noteInTheList = document.createElement('div');
    noteInTheList.className = 'noteInTheList';

    let noteListButton = document.createElement('button');
    noteListButton.className = 'noteListButton';
    noteListButton.addEventListener('click',(e) =>
    {
        loadNote(e.target.textContent);
        selectedNote(e);
    });
    noteInTheList.appendChild(noteListButton);

    let noteListText = document.createElement('span');
    noteListText.className = 'noteListText';
    noteListText.innerText = noteName;
    noteListButton.appendChild(noteListText);

    notesList.appendChild(noteInTheList);
}

function deleteListButton(noteName)
{
    let noteInTheListArray = document.getElementsByClassName('noteInTheList');
    for(let i = 0; i < noteInTheListArray.length; i++)
    {
        let a = noteInTheListArray[i];
        let b = a.children;
        let c = b[0].children;
        let note = c[0].innerText;

        if(note === noteName)
        {
            a.remove();
            return;
        }
    }
}

function youDontHaveNotes()
{
    let howManyNotes = notesList.childElementCount;

    if(howManyNotes <= 0) dontNotes.hidden = false;
    else dontNotes.hidden = true;
}

async function selectedNote(e)
{
    let noteInTheListArray = document.getElementsByClassName('noteInTheList');

    for(let i = 0; i < noteInTheListArray.length; i++)
    {
        noteInTheListArray[i].className = noteInTheListArray[i].className.replace(' noteSelected','');
        noteInTheListArray[i].children[0].className = noteInTheListArray[i].children[0].className.replace(' noteSelected', '');
        noteInTheListArray[i].children[0].children[0].className = noteInTheListArray[i].children[0].children[0].className.replace(' noteSelected', '');
    }
    e.target.className += ' noteSelected';
}