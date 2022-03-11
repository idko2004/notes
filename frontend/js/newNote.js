newNote.addEventListener('click',function()
{
    if(!canInteract) return;

    floatingWindow(
    {
        title: 'Nueva nota',
        text: '¿Qué nombre le pondrás a tu nueva nota?',
        input: true,
        buttons:
        [
            {
                text: 'Cancelar',
                primary: false,
                callback: function()
                {
                    closeWindow();
                }
            },
            {
                text: 'Crear nota',
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
    if(!newNoteNameIsValid(name)) return;
    if(isLocalMode)
    {
        createListButton(name);

        saveKey(name,'');
        loadNote(name);
    
        youDontHaveNotes();
    
        selectedNote(undefined, name);
    }
    else
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
                title: 'Nombre inválido',
                text: 'El nombre que le has puesto a esta nota no es válido, intenta con otro.',
                button:
                {
                    text: 'Aceptar',
                    callback: function(){closeWindow()}
                }
            });
        }
        else
        {
            console.error(response);
            floatingWindow(
            {
                title: 'Ocurrió un error',
                text: `Ocurrió un error desconocido: ${response.data.error}`,
                button:
                {
                    text: 'Aceptar',
                    callback: function(){closeWindow()}
                }
            });
        }
    }

}

function newNoteNameIsValid(name)
{
    closeWindow(); //Por si haya una ventana abierta

    if(name === '')
    {
        floatingWindow
        ({
            title: 'Escribe un nombre',
            text: 'La nota no puede tener un nombre vacío.',
            button:
            {
                text: 'Aceptar',
                callback: () =>
                {
                    closeWindow();
                    newNote.click();
                }
            }
        });
        return false;
    }
    if(name.startsWith('_'))
    {
        floatingWindow
        ({
            title: '_Error',
            text: 'El nombre de una nota no puede empezar con "_"',
            button:
            {
                text: 'Aceptar',
                callback: () =>
                {
                    closeWindow();
                    newNote.click();
                }
            }
        });
        return false;
    }
    if(name.length > 30)
    {
        floatingWindow
        ({
            title: 'Acorta el nombre',
            text: 'El nombre de la nota es demasiado largo.',
            button:
            {
                text: 'Aceptar',
                callback: () =>
                {
                    closeWindow();
                    newNote.click();
                }
            }
        });
        return false;
    }
    if(isLocalMode && getKey(name) !== null)
    {
        floatingWindow
        ({
            title: 'Nota duplicada',
            text: `Ya existe una nota con el nombre '${name}'`,
            button:
            {
                text: 'Aceptar',
                callback: () =>
                {
                    closeWindow();
                    newNote.click();
                }
            }
        });
        return false;
    }

    return true;
}