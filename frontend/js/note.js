textArea.value = '';
textArea.disabled = true;

async function loadNote(name, id)
{
    console.log('Cargar nota',name, id);

    if(actualNoteName !== undefined)
    {
        noteName.innerText = getText('savingNote');
        await saveNote();
    }

    textArea.value = '';
    textArea.disabled = true;

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
            const response = await axios.get(`${path}/note`, {headers: {key: theSecretThingThatNobodyHasToKnow, noteid: id}});
            console.log(response);
            if(response.data.error !== undefined) //Ocurre un error
            {
                noteName.innerText = getText('loadNoteFailed');
                actualNoteID = undefined;
                actualNoteName = undefined;
                textArea.value = '';
                topBarButtons.hidden = true;
                theLastTextSave = '';
    
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
                return;
            }
            if(response.data.note !== undefined) noteContent = response.data.note;
            else
            {
                console.error('error cargando la nota');
                noteName.innerText = getText('loadNoteFailed');
                actualNoteID = undefined;
                actualNoteName = undefined;
                textArea.value = '';
                topBarButtons.hidden = true;
                theLastTextSave = '';
                
                floatingWindow(
                {
                    title: getText('loadNoteFailed'),
                    text: getText('noErrorCode'),
                    button:
                    {
                        text: getText('ok'),
                        callback: function(){closeWindow()}
                    }
                });
                return;
            }
        }
        catch
        {
            noteName.innerText = getText('loadNoteFailed');
            actualNoteID = undefined;
            actualNoteName = undefined;
            textArea.value = '';
            topBarButtons.hidden = true;
            theLastTextSave = '';
            floatingWindow(
            {
                title: getText('ups'),
                text: getText('serverDown'),
                button:
                {
                    text: getText('ok'),
                    callback: function(){closeWindow()}
                }
            });
            return;
        }
    }

    noteName.innerText = name;
    actualNoteName = name;

    actualNoteID = id;

    textArea.value = noteContent;
    textArea.disabled = false;
    topBarButtons.hidden = false;

    theLastTextSave = noteContent;

    showTheNoteInSmallScreen(true);

    setTimeout(function()
    {
        noteField.focus();
        resizeTwice();
    }, 15);
}

//Botón de guardar nota
document.getElementById('saveButton').addEventListener('click', async function(e)
{
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

let theLastTextSave = '';
let serverDownAdvertisement = false; //Para que no salga el mensaje cada vez cuando el server está caído.
async function saveNote()
{
    let name = actualNoteName;
    if(name === undefined) return null;

    let value = textArea.value;
    if(theLastTextSave === value) return true;

    let noteID = actualNoteID;

    if(isLocalMode)
    {
        saveKey(name, value);
        return true;
    }
    else
    {
        if(noteID === undefined) return console.error('No se pudo guardar la nota, noteID undefined');
        saveKey(name, value);

        try
        {
            console.log('Guardando nota', actualNoteID);
            const response = await axios.post(`${path}/saveNote`,
            {
                key: theSecretThingThatNobodyHasToKnow,
                noteID: noteID,
                noteContent: value
            });

            if(response.data.result === 1)
            {
                console.log('Nota guardada');
                serverDownAdvertisement = false; //Si se vuelve a caer el server, para poder volver a avisar.
                return true;
            }
            else
            {
                console.log('Hubo un error guardando la nota', response.data.result);
                return false;
            }    
        }
        catch
        {
            console.log('El servidor se ha caido así que no se puede guardar la nota.');
            if(serverDownAdvertisement) return false;
            if(!thereIsAWindows) floatingWindow(
            {
                title: getText('ups'),
                text: getText('serverDown'),
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

//Botón de borrar nota
document.getElementById('deleteButton').addEventListener('click',(e) =>
{
    if(!canInteract) return;

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
                callback: () => {closeWindow()}
            },
            {
                text: getText('deleteNote_btn2'),
                primary: true,
                callback: async function()
                {
                    if(isLocalMode)
                    {
                        actualNoteName = undefined;
                        deleteKey(name);

                        textArea.value = '';
                        textArea.disabled = true;
                    
                        noteName.innerText = getText('clickANote');
                        topBarButtons.hidden = true;
                    
                        deleteListButton(name);
                        youDontHaveNotes();
                        
                        closeWindow();
                    }
                    else
                    {
                        closeWindow();
                        floatingWindow(
                        {
                            title: getText('deletingNote'),
                            text: getText('waitAMoment')
                        });

                        const response = await axios.post(`${path}/deleteNote`, {key: theSecretThingThatNobodyHasToKnow, noteid: actualNoteID});

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

                            closeWindow();
                        }
                        else
                        {
                            closeWindow();
                            floatingWindow(
                            {
                                title: 'Oh, no!',
                                text: `${getText('somethingWentWrong')}\n${getText('errorCode')}: ${response.data.error}`,
                                button:
                                {
                                    text: getText('ok'),
                                    callback: function(){closeWindow();}
                                }
                            });
                        }
                    }
                }
            }
        ]
    });
});

setInterval(async function()
{
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

document.getElementById('downloadButton').addEventListener('click', function()
{
    if(!canInteract) return;

    console.log('descargar documento');
    let name = noteName.innerText;
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
                callback: function()
                {
                    closeWindow();
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

                    if(!newNoteNameIsValid(value, 'renameNote')) return;

                    if(!isLocalMode)
                    {
                        try
                        {
                            const response = await axios.post(`${path}/renameNote`,{key: theSecretThingThatNobodyHasToKnow, noteid: actualNoteID, newname: value});
                            if(response.data.error === 'invalidName')
                            {
                                closeWindow();
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
                                closeWindow();
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
                        }
                        catch
                        {
                            closeWindow();
                            floatingWindow(
                            {
                                title: getText('ups'),
                                text: getText('serverDown'),
                                button:
                                {
                                    text: getText('ok'),
                                    callback: function(){closeWindow()}
                                }
                            });
                            return;
                        }
                    }

                    deleteKey(noteName.innerText);
                    saveKey(value,textArea.value);

                    deleteListButton(noteName.innerText);
                    createListButton(value);
                    youDontHaveNotes();

                    noteName.innerText = value;
                    selectedNote(undefined, value);

                    closeWindow();
                    textArea.focus();
                }
            }
        ]
    });
;})