textArea.value = '';
textArea.disabled = true;

async function loadNote(name, id)
{
    console.log('Cargar nota',name, id);

    if(actualNoteName !== undefined)
    {
        noteName.innerText = '(Guardando nota...)';
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
        noteName.innerText = 'Cargando...';

        try
        {
            //Cargar la nota
            const response = await axios.get(`${path}/note`, {headers: {key: theSecretThingThatNobodyHasToKnow, noteid: id}});
            console.log(response);
            if(response.data.error !== undefined) //Ocurre un error
            {
                floatingWindow(
                {
                    title: 'Ha ocurrido un error',
                    text: `Por favor, la página se recargará.\n${response.data.error}`
                });
                setInterval(function()
                {
                    location.reload();
                },18000);
                return;
            }
            if(response.data.note !== undefined) noteContent = response.data.note;
            else
            {
                console.error('error cargando la nota');
                return;
            }
        }
        catch
        {
            noteName.innerText = 'No se pudo cargar la nota.';
            actualNoteID = undefined;
            actualNoteName = undefined;
            textArea.value = '';
            topBarButtons.hidden = true;
            theLastTextSave = '';
            floatingWindow(
            {
                title: 'Error al cargar la nota',
                text: 'Parece que el servidor se ha caído, prueba a intentar de nuevo dentro de un rato.',
                button:
                {
                    text: 'Aceptar',
                    callback: function()
                    {
                        closeWindow();
                    }
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
    }, 15);
}

//Botón de guardar nota
document.getElementById('saveButton').addEventListener('click', async function(e)
{
    if(!canInteract) return;

    if(isLocalMode) sayThings.innerText = '(Guardando...)';

    const saved = await saveNote();
    if(saved) sayThings.innerText = '(Guardado).';
    else sayThings.innerText = '(Error al guardar).';

    setTimeout(() =>
    {
        sayThings.innerText = '';
    },1500);
});

let theLastTextSave = '';
let serverDownAdvertisement = false; //Para que no salga el mensaje cada vez cuando el server está caído.
async function saveNote()
{
    if(!canInteract) return null;

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
                title: '¡Servidor caído!',
                text: 'El servidor no responde, por lo que no se podrá guardar tu nota en la nube. Por si acaso, guardamos esta nota en tu navegador.',
                button:
                {
                    text: 'Aceptar',
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
        title: '¿Borrar nota?',
        text: `¿Estás seguro que quieres borrar la nota '${name}'?\nSi la borras se irá para siempre.`,
        buttons:
        [
            {
                text: 'No, quiero conservarla',
                primary: false,
                callback: () => {closeWindow()}
            },
            {
                text: 'Sí, borra la nota',
                primary: true,
                callback: () =>
                {
                    deleteKey(name);

                    textArea.value = '';
                    textArea.disabled = true;
                
                    noteName.innerText = 'Haz click sobre una nota.'
                    topBarButtons.hidden = true;
                
                    deleteListButton(name);
                    youDontHaveNotes();
                    
                    closeWindow();
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
    if(theSecretThingThatNobodyHasToKnow === 'local') sayThings.innerText = '(Guardando automáticamente...)';
    
    const saved = await saveNote();
    if(saved)
    {
        sayThings.innerText = '(Guardado).';
        console.log('Guardado automáticamente');
    }
    else
    {
        sayThings.innerText = '(Error al guardar).';
        console.log('Error al guardar automáticamente');
    }

    setTimeout(function()
    {
        sayThings.innerText = '';
    },1500);
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
        title: 'Renombrar la nota',
        text: `Elige un nuevo nombre para la nota '${noteName.innerText}'`,
        input: true,
        buttons:
        [
            {
                text: 'Dejarlo como estaba',
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
                text: 'Renombrar',
                primary: true,
                callback: function()
                {
                    const input = document.getElementById('inputInTheWindow');

                    if(!newNoteNameIsValid(input.value))
                    {
                        input.value = '';
                        return;
                    }

                    deleteKey(noteName.innerText);
                    saveKey(input.value,textArea.value);

                    deleteListButton(noteName.innerText);
                    createListButton(input.value);
                    youDontHaveNotes();

                    noteName.innerText = input.value;
                    selectedNote(undefined, input.value);

                    closeWindow();
                    textArea.focus();
                    input.value = '';
                }
            }
        ]
    });
;})