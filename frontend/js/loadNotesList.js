async function loadNotesList()
{
    console.log('Cargando lista de notas');
    loadingScreen.hidden = false;

    if(isLocalMode)
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
        try
        {
            console.log('http: obteniendo ids de las notas');
            const response = await encryptHttpCall('/getNotesID',
            {
                deviceID,
                encrypt:
                {
                    key: theSecretThingThatNobodyHasToKnow
                }
            }, theOtherSecretThing);

            console.log(response);
            if(response.data.error !== undefined)
            {
                //Ha ocurrido un error
                loadingScreen.hidden = true;
                floatingWindow(
                {
                    title: getText('somethingWentWrong'),
                    text: `${getText('errorCode')}: ${response.data.error}`,
                    buttons:
                    [
                        {
                            text: getText('lnl_eraseData'),
                            primary: false,
                            callback: async function()
                            {
                                await closeWindow();
                                deleteKey('_login');
                                deleteKey('_pswrd');
                                location.reload();
                            }
                        },
                        {
                            text: getText('reload'),
                            primary: true,
                            callback: async function()
                            {
                                await closeWindow();
                                location.reload();
                            }
                        }
                    ]
                });
                return;
            }


            const notesArray = response.data.decrypt.notesID;
            for(let i = 0; i < notesArray.length; i++)
            {
                let name = notesArray[i].name;
                let id = notesArray[i].id;
                createListButton(name,id);
            }

        }
        catch(err)
        {
            //Ha ocurrido un error
            loadingScreen.hidden = true;
            floatingWindow(
            {
                title: getText('ups'),
                text: `${getText('somethingWentWrong')}\n\n${getText('errorCode')}: ${err.message}`,
                button:
                {
                    text: getText('reload'),
                    callback: async function()
                    {
                        await closeWindow();
                        location.reload();
                    }
                }
            });
            return;
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

    noteListButton.addEventListener('click', async function(e)
    {
        if(!canInteract) return;
        if(theActualThing !== 'note') return;

        let id = undefined;
        if(e.target.attributes.noteID) id = e.target.attributes.noteID.value;

        if((id !== actualNoteID || (isLocalMode || actualNoteIsLocal)) && e.target.innerText !== actualNoteName)
        {
            loadNote(e.target.innerText, id);
            selectedNote(e);
        }
        else //Si es la misma nota que ya estaba cargada
        {
            showTheNoteInSmallScreen(true);
            setTimeout(function(){textArea.focus()}, 10);
        }
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

    if(howManyNotes <= 0)
    {
        dontNotes.hidden = false;
        notesList.hidden = true;
    }
    else
    {
        dontNotes.hidden = true;
        notesList.hidden = false;
    }
}

function selectedNote(e, altNoteName)
{
    let noteInTheListArray = document.getElementsByClassName('noteInTheList');

    for(let i = 0; i < noteInTheListArray.length; i++) noteInTheListArray[i].children[0].classList.remove('noteSelected');

    if(e !== undefined) e.target.classList.add('noteSelected');
    else
    {
        for(let i = 0; i < noteInTheListArray.length; i++)
        {
            if(noteInTheListArray[i].children[0].innerText === altNoteName)
            {
                noteInTheListArray[i].children[0].classList.add('noteSelected');
                return;
            }
        }
    }
}