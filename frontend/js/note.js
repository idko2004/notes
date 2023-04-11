textArea.value = '';
textArea.disabled = true;

async function loadNote(name, id)
{
    console.log('Cargar nota',name, id);
    if(theActualThing !== 'note') return;
    theActualThing = 'loading';

    if(actualNoteName !== undefined)
    {
        noteName.innerText = getText('savingNote');
        await saveNote();
    }

    textArea.value = '';
    textArea.disabled = true;
    showTheNoteInSmallScreen(true);

    let noteContent = null;
    if(id === undefined)
    {
        noteContent = getKey(name);
    }
    else
    {
        noteName.innerText = getText('loading');

        try
        {
            //Cargar la nota
            console.log('http: cargando nota');
            const response = await encryptHttpCall('/note',
            {
                deviceID,
                encrypt:
                {
                    noteid: id,
                    key: theSecretThingThatNobodyHasToKnow
                }
            }, theOtherSecretThing);
            console.log(response);

            if(response.data.error !== undefined) //Ocurre un error
            {
                noteName.innerText = getText('loadNoteFailed');
                actualNoteID = undefined;
                actualNoteName = undefined;
                textArea.value = '';
                topBarButtons.hidden = true;
                theLastTextSave = '';
                theActualThing = 'ventana';

                floatingWindow(
                {
                    title: getText('somethingWentWrong'),
                    text: `${getText('errorCode')}: ${response.data.error}`,
                    button:
                    {
                        text: getText('ok'),
                        callback: function()
                        {
                            theActualThing = 'note';
                            closeWindow();
                        }
                    }
                });
                return;
            }
            if(response.data.decrypt.note !== undefined) noteContent = response.data.decrypt.note;
            else
            {
                console.error('error cargando la nota');
                noteName.innerText = getText('loadNoteFailed');
                actualNoteID = undefined;
                actualNoteName = undefined;
                textArea.value = '';
                topBarButtons.hidden = true;
                theLastTextSave = '';
                theActualThing = 'ventana';
                
                floatingWindow(
                {
                    title: getText('loadNoteFailed'),
                    text: getText('noErrorCode'),
                    button:
                    {
                        text: getText('ok'),
                        callback: function()
                        {
                            theActualThing = 'note';
                            closeWindow();
                        }
                    }
                });
                return;
            }
        }
        catch(err)
        {
            console.log(err);
            noteName.innerText = getText('loadNoteFailed');
            actualNoteID = undefined;
            actualNoteName = undefined;
            textArea.value = '';
            topBarButtons.hidden = true;
            theLastTextSave = '';

            //Intentar cargar copia local
            const searchInLocal = getKey(name);
            if(!localCopy || searchInLocal === null)
            {
                theActualThing = 'ventana';
                floatingWindow(
                {
                    title: getText('ups'),
                    text: `${getText('somethingWentWrong')}\n\n${getText('errorCode')}: ${err.message}`,
                    button:
                    {
                        text: getText('ok'),
                        callback: function()
                        {
                            theActualThing = 'note';
                            closeWindow();
                        }
                    }
                });
                return;
            }
            else
            {
                theActualThing = 'ventana';
                floatingWindow(
                {
                    title: getText('localFound1'),
                    text: getText('localFound2'),
                    buttons:
                    [
                        {
                            text: getText('viewLocalCopy'),
                            primary: false,
                            callback: async function()
                            {
                                await closeWindow();
                                console.log('cargar copia local');
                                actualNoteIsLocal = true;

                                noteName.innerText = name;
                                actualNoteName = name;
                            
                                actualNoteID = id;
                            
                                textArea.value = searchInLocal;
                                textArea.disabled = false;
                                topBarButtons.hidden = false;
                            
                                theLastTextSave = searchInLocal;
                            
                                showTheNoteInSmallScreen(true);

                                theActualThing = 'note';
                            
                                setTimeout(function()
                                {
                                    textArea.focus();
                                    resizeTwice();
                                }, 15);
                            }
                        },
                        {
                            text: getText('cancel'),
                            primary: true,
                            callback: function()
                            {
                                theActualThing = 'note';
                                closeWindow();
                            }
                        }
                    ]
                });
                return;
            }

        }
    }

    actualNoteIsLocal = false;

    noteName.innerText = name;
    actualNoteName = name;

    actualNoteID = id;

    textArea.value = noteContent;
    textArea.disabled = false;
    topBarButtons.hidden = false;

    theLastTextSave = noteContent;

    theActualThing = 'note';

    setTimeout(function()
    {
        resizeTwice();
        textArea.focus();
    }, 15);
}

let theLastTextSave = '';
let serverDownAdvertisement = false; //Para que no salga el mensaje cada vez cuando el server está caído.
async function saveNote()
{
    if(!['note', 'loading'].includes(theActualThing)) return;

    let name = actualNoteName;
    if(name === undefined) return null;

    let value = textArea.value;
    if(theLastTextSave === value) return true;

    let noteID = actualNoteID;

    if(isLocalMode || actualNoteIsLocal)
    {
        saveKey(name, value);
        theLastTextSave = value;
        console.log('Nota guardada en modo local');
        return true;
    }
    else
    {
        if(noteID === undefined) return console.error('No se pudo guardar la nota, noteID undefined');
        if(localCopy) saveKey(name, value);

        try
        {
            console.log('Guardando nota', actualNoteID);
            console.log('http: guardando nota');
            const response = await encryptHttpCall('/saveNote',
            {
                deviceID,
                encrypt:
                {
                    key: theSecretThingThatNobodyHasToKnow,
                    noteID,
                    noteContent: value
                }
            }, theOtherSecretThing);

            if(response.data.result === 1)
            {
                console.log('Nota guardada');
                serverDownAdvertisement = false; //Si se vuelve a caer el server, para poder volver a avisar.
                theLastTextSave = value;
                return true;
            }
            else
            {
                console.log('Hubo un error guardando la nota', response.data.result);
                return false;
            }
        }
        catch(err)
        {
            console.log('El servidor se ha caido así que no se puede guardar la nota.');
            console.log(err);
            if(serverDownAdvertisement) return false;
            if(!thereIsAWindows) floatingWindow(
            {
                title: getText('ups'),
                text: `${getText('somethingWentWrong')}\n\n${getText('errorCode')}: ${err.message}`,
                button:
                {
                    text: getText('ok'),
                    callback: function()
                    {
                        closeWindow();
                    }
                }
            });
            serverDownAdvertisement = true;
            return false;
        }
    }
}

//Botón de guardar nota
document.getElementById('saveButton').addEventListener('click', async function()
{
    if(theActualThing !== 'note') return;
    if(!canInteract) return;

    if(!isLocalMode) sayThings.innerText = getText('savingNote');

    const saved = await saveNote();
    if(saved) sayThings.innerText = getText('saved');
    else sayThings.innerText = getText('saveFailed');

    setTimeout(() =>
    {
        sayThings.innerText = '';
    },2000);
});

//Botón de borrar nota
document.getElementById('deleteButton').addEventListener('click',() =>
{
    if(theActualThing !== 'note') return;
    if(!canInteract) return;
    theActualThing = 'ventana';

    let name = noteName.innerText;

    if(!thereIsAWindows) floatingWindow
    ({
        title: getText('deleteNote_title'),
        text: getText('deleteNote_text',[name]),
        buttons:
        [
            {
                text: getText('deleteNote_btn1'),
                primary: false,
                callback: () => 
                {
                    theActualThing = 'note';
                    closeWindow();
                }
            },
            {
                text: getText('deleteNote_btn2'),
                primary: true,
                callback: async function()
                {
                    if(isLocalMode)
                    {
                        await closeWindow();
                        actualNoteName = undefined;
                        deleteKey(name);

                        textArea.value = '';
                        textArea.disabled = true;
                    
                        noteName.innerText = getText('clickANote');
                        topBarButtons.hidden = true;
                    
                        deleteListButton(name);
                        youDontHaveNotes();
                        theActualThing = 'note';
                    }
                    else try
                    {
                        await closeWindow();
                        theActualThing = 'loading';
                        noteName.innerText = getText('deletingNote');

                        console.log('http: borrando nota');
                        const response = await encryptHttpCall('/deleteNote',
                        {
                            deviceID,
                            encrypt:
                            {
                                noteid: actualNoteID,
                                key: theSecretThingThatNobodyHasToKnow
                            }
                        }, theOtherSecretThing);

                        if(response.data.error === undefined)
                        {
                            actualNoteID = undefined;
                            actualNoteName = undefined;
                            deleteKey(name);

                            textArea.value = '';
                            textArea.disabled = true;

                            noteName.innerText = getText('clickANote');
                            topBarButtons.hidden = true;

                            deleteListButton(name);
                            youDontHaveNotes();
                            theActualThing = 'note';

                            showTheNote = false;
                            resizeElements();
                        }
                        else
                        {
                            theActualThing = 'ventana';
                            floatingWindow(
                            {
                                title: getText('somethingWentWrong'),
                                text: `${getText('errorCode')}: ${response.data.error}`,
                                button:
                                {
                                    text: getText('ok'),
                                    callback: function()
                                    {
                                        theActualThing = 'note';
                                        noteName.innerText = actualNoteName;
                                        closeWindow();
                                    }
                                }
                            });
                        }
                    }
                    catch(err)
                    {
                        theActualThing = 'ventana';
                        floatingWindow(
                        {
                            title: getText('ups'),
                            text: `${getText('somethingWentWrong')}\n\n${getText('errorCode')}: ${err.message}`,
                            button:
                            {
                                text: getText('ok'),
                                callback: function()
                                {
                                    theActualThing = 'note';
                                    noteName.innerText = actualNoteName;
                                    closeWindow();
                                }
                            }
                        });
                    }
                }
            }
        ]
    });
});

document.getElementById('downloadButton').addEventListener('click', function()
{
    if(theActualThing !== 'note') return;
    if(!canInteract) return;

    console.log('descargar documento');
    let name = actualNoteName;
    let text = textArea.value;

    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    a.setAttribute('download', `${name}.txt`);
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

document.getElementById('renameButton').addEventListener('click', function()
{
    if(theActualThing !== 'note') return;
    if(!canInteract) return;

    floatingWindow
    ({
        title: getText('rename_title'),
        text: `${getText('rename_text')} '${noteName.innerText}'`,
        input: true,
        buttons:
        [
            {
                text: getText('rename_btn1'),
                primary: false,
                callback: async function()
                {
                    await closeWindow();
                    textArea.focus();

                    const input = document.getElementById('inputInTheWindow');
                    input.value = '';
                }
            },
            {
                text: getText('rename_btn2'),
                primary: true,
                callback: async function()
                {
                    const value = document.getElementById('inputInTheWindow').value;
                    await closeWindow();
                    if(!newNoteNameIsValid(value, 'renameNote')) return;

                    if(!isLocalMode)
                    {
                        try
                        {
                            noteName.innerText = getText('renaming');

                            console.log('http: renombrando nota');
                            const response = await encryptHttpCall('/renameNote',
                            {
                                deviceID,
                                encrypt:
                                {
                                    noteid: actualNoteID,
                                    newname: value,
                                    key: theSecretThingThatNobodyHasToKnow
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
                                return;
                            }
                            if(response.data.error !== undefined)
                            {
                                floatingWindow(
                                {
                                    title: getText('somethingWentWrong'),
                                    text: `${getText('errorCode')}: ${response.error}`,
                                    button:
                                    {
                                        text: getText('ok'),
                                        callback: function(){closeWindow()}
                                    }
                                });
                                return;
                            }

                            renameNoteLocally();
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
                                    callback: function(){closeWindow()}
                                }
                            });
                            return;
                        }
                    }
                    else renameNoteLocally();

                    function renameNoteLocally()
                    {
                        deleteKey(actualNoteName);
                        saveKey(value,textArea.value);

                        deleteListButton(actualNoteName);
                        createListButton(value);
                        selectedNote(undefined, value);
                        youDontHaveNotes();

                        noteName.innerText = value;
                        actualNoteName = value;

                        textArea.focus();
                    }
                }
            }
        ]
    });
});

setInterval(async function()
{
    if(theActualThing !== 'note') return;
    console.log('Intentando guardar automáticamente.');
    if(!canInteract) return;
    if(textArea.disabled === true) return;
    if(theLastTextSave === textArea.value) return;
    sayThings.innerText = getText('autosave');

    const saved = await saveNote();
    if(saved)
    {
        sayThings.innerText = getText('saved');
        console.log('Guardado automáticamente');
    }
    else
    {
        sayThings.innerText = getText('saveFailed');
        console.log('Error al guardar automáticamente');
    }

    setTimeout(function()
    {
        sayThings.innerText = '';
    },2000);
},60000/*Un minuto*/);
