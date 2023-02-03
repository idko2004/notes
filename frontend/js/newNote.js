newNote.addEventListener('click',function()
{
    if(!canInteract) return;
    if(theActualThing !== 'note') return;
    theActualThing = 'ventana';

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
                    theActualThing = 'note';
                    closeWindow();
                }
            },
            {
                text: getText('createNote'),
                primary: true,
                callback: async function()
                {
                    const name = document.getElementById('inputInTheWindow').value;
                    await closeWindow();
                    theActualThing = 'note';
                    createNewNote(name);
                }
            }
        ]
    });
});

async function createNewNote(name)
{
    if(theActualThing !== 'note') return;
    if(!newNoteNameIsValid(name, 'newNote')) return;
    theActualThing = 'loading';

    textArea.disabled = true;
    topBarButtons.hidden = true;
    await saveNote();

    if(isLocalMode)
    {
        actualNoteName = name;

        createListButton(name);
        youDontHaveNotes();

        selectedNote(undefined, name);

        noteName.innerText = name;
        topBarButtons.hidden = false;

        textArea.value = '';
        textArea.disabled = false;
        textArea.focus();

        saveKey(name,'');
    }
    else try
    {
        noteName.innerText = getText('creatingNote');
        textArea.value = '';
    
        console.log('http: creando nota');
        const response = await encryptHttpCall('/createNewNote',
        {
            deviceID,
            encrypt:
            {
                key: theSecretThingThatNobodyHasToKnow,
                notename: name
            },
        }, theOtherSecretThing);

        if(response.data.error === 'invalidName')
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
            noteName.innerText = getText('clickANote');
        }
        else if(response.data.decrypt === undefined || response.data.error !== undefined)
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
            noteName.innerText = getText('somethingWentWrong');
        }
        else if(response.data.ok || response.data.decrypt.noteid !== undefined)
        {
            //salió bien y la nota se crea exitosamente
            actualNoteID = response.data.decrypt.noteid;
            actualNoteName = name;

            createListButton(name, response.data.decrypt.noteid);
            youDontHaveNotes();

            selectedNote(undefined, name);

            noteName.innerText = name;
            topBarButtons.hidden = false;

            textArea.value = '';
            textArea.disabled = false;
            textArea.focus();

            saveKey(name,'');
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
            noteName.innerText = getText('somethingWentWrong');
        }
    }
    catch(err)
    {
        floatingWindow(
        {
            title: getText('ups'),
            text: `${getText('somethingWentWrong')}\n\n${getText('errorCode')}: ${err.message}`,
            button:
            {
                text: getText('ok'),
                callback: closeWindow
            }
        });
        noteName.innerText = getText('somethingWentWrong');
    }
    theActualThing = 'note';
}

function newNoteNameIsValid(name, openAWindow)
{
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
    if(name.length > 40)
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

    async function closeInvalidNameWindow()
    {
        await closeWindow();
        if(openAWindow === 'newNote') newNote.click();
        else if(openAWindow === 'renameNote') document.getElementById('renameButton').click();
    }
}
