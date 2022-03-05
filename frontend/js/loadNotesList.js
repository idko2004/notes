async function loadNotesList()
{
    console.log('Cargando lista de notas');
    loadingScreen.hidden = false;

    let loginKey = theSecretThingThatNobodyHasToKnow;
    if(loginKey === 'local')
    {
        let notesNames = getKeyNames();
    
        for(let i = 0; i < notesNames.length; i++)
        {
            if(notesNames[i] === '') continue;
            if(notesNames[i].startsWith('_')) continue;
            createListButton(notesNames[i]);
        }
    }
    else
    {
        console.log(loginKey);
        const response = await axios.get(`${path}/getNotesID`, {headers: {key: loginKey}});
        console.log(response);
        const notesArray = response.data.notesID;
        for(let i = 0; i < notesArray.length; i++)
        {
            let name = notesArray[i].name;
            let id = notesArray[i].id;
            createListButton(name,id);
        }
    }
    
    youDontHaveNotes();
    loadingScreen.hidden = true;
    document.getElementById('noteScreen').hidden = false;

    console.log('Lista de notas cargada');
}

function createListButton(noteName, id)
{
    let noteInTheList = document.createElement('div');
    noteInTheList.className = 'noteInTheList';

    let noteListButton = document.createElement('button');
    noteListButton.className = 'noteListButton';

    noteListButton.innerText = noteName;

    if(id !== undefined) noteListButton.setAttribute('noteID', id);

    noteListButton.addEventListener('click',(e) =>
    {
        if(!canInteract) return;
        let id = undefined;
        if(e.target.attributes.noteID) id = e.target.attributes.noteID.value;

        loadNote(e.target.textContent, id);
        selectedNote(e);
    });
    noteInTheList.appendChild(noteListButton);

    notesList.appendChild(noteInTheList);
}

function deleteListButton(noteName)
{
    let noteInTheListArray = document.getElementsByClassName('noteInTheList');
    for(let i = 0; i < noteInTheListArray.length; i++)
    {
        let a = noteInTheListArray[i];
        let note = a.innerText;

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

async function selectedNote(e, altNoteName)
{
    let noteInTheListArray = document.getElementsByClassName('noteInTheList');

    for(let i = 0; i < noteInTheListArray.length; i++) noteInTheListArray[i].children[0].className = noteInTheListArray[i].children[0].className.replace(' noteSelected', '');

    if(e !== undefined) e.target.className += ' noteSelected';
    else
    {
        for(let i = 0; i < noteInTheListArray.length; i++)
        {
            if(noteInTheListArray[i].children[0].innerText === altNoteName) noteInTheListArray[i].children[0].className += ' noteSelected';
        }
    }
}