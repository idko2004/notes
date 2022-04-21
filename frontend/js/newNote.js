newNote.addEventListener('click',function()
{
    if(!canInteract) return;

    floatingWindow(
    {
        title: getText('newNote'),
        text: getText('newNote_text'),
        input: true,
        buttons:
        [
            {
                text: getText('cancel'),
                primary: false,
                callback: function()
                {
                    closeWindow();
                }
            },
            {
                text: getText('createNote'),
                primary: true,
                callback()
                {
                    const name = document.getElementById('inputInTheWindow').value;
                    createNewNote(name);
                }
            }
        ]
    });
});

async function createNewNote(name)
{
    if(!newNoteNameIsValid(name, 'newNote')) return;
    if(isLocalMode)
    {
        createListButton(name);

        saveKey(name,'');
        loadNote(name);
    
        youDontHaveNotes();
    
        selectedNote(undefined, name);
    }
    else try
    {
        const response = await axios.post(`${path}/createNewNote`, {key: theSecretThingThatNobodyHasToKnow, notename: name});
        if(response.data.ok || response.data.noteid !== undefined)
        {
            actualNoteID = response.data.noteid;
            actualNoteName = name;

            createListButton(name, response.data.noteid);
            youDontHaveNotes();

            selectedNote(undefined, name);

            noteName.innerText = name;
            topBarButtons.hidden = false;

            textArea.value = '';
            textArea.disabled = false;
            textArea.focus();

            saveKey(name,'');
        }
        else if(response.data.error === 'invalidName')
        {
            floatingWindow(
            {
                title: getText('newNote_invalidName_title'),
                text: getText('newNote_invalidName_text'),
                button:
                {
                    text: getText('ok'),
                    callback: function(){closeWindow()}
                }
            });
        }
        else
        {
            console.error(response);
            floatingWindow(
            {
                title: getText('somethingWentWrong'),
                text: `${getText('errorCode')}: ${response.data.error}`,
                button:
                {
                    text: getText('ok'),
                    callback: function(){closeWindow()}
                }
            });
        }
    }
    catch
    {
        floatingWindow(
        {
            title: getText('ups'),
            text: getText('serverDown'),
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });
    }
}

function newNoteNameIsValid(name, openAWindow)
{
    closeWindow(); //Por si haya una ventana abierta

    if(name === '')
    {
        floatingWindow
        ({
            title: getText('newNote_emptyName_title'),
            text: getText('newNote_emptyName_text'),
            button:
            {
                text: getText('ok'),
                callback: closeInvalidNameWindow
            }
        });
        return false;
    }
    if(name.startsWith('_'))
    {
        floatingWindow
        ({
            title: '_Error',
            text: getText('newNote___'),
            button:
            {
                text: getText('ok'),
                callback: closeInvalidNameWindow
            }
        });
        return false;
    }
    if(name.length > 30)
    {
        floatingWindow
        ({
            title: getText('newNote_tooLongName_title'),
            text: getText('newNote_tooLongName_text'),
            button:
            {
                text: getText('ok'),
                callback: closeInvalidNameWindow
            }
        });
        return false;
    }
    if(isLocalMode && getKey(name) !== null)
    {
        floatingWindow
        ({
            title: getText('newNote_duplicated_title'),
            text: `${getText('newNote_duplicated_text')} '${name}'`,
            button:
            {
                text: getText('ok'),
                callback: closeInvalidNameWindow
            }
        });
        return false;
    }
    //TODO: Comprobar si hay una nota en la lista con el mismo nombre

    return true;

    function closeInvalidNameWindow()
    {
        closeWindow();

        if(openAWindow === 'newNote') newNote.click();
        else if(openAWindow === 'renameNote') document.getElementById('renameButton').click();
    }
}