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
                    const noteName = document.getElementById('inputInTheWindow').value;
                    createNewNote(noteName);
                }
            }
        ]
    });
});

function createNewNote(noteName)
{
    if(!newNoteNameIsValid(noteName)) return;

    createListButton(noteName);

    saveKey(noteName,'');
    loadNote(noteName);

    youDontHaveNotes();

    selectedNote(undefined, noteName);
}

function newNoteNameIsValid(noteName)
{
    closeWindow(); //Por si haya una ventana abierta

    if(noteName === '')
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
    if(noteName.startsWith('_'))
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
    if(noteName.length > 30)
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
    if(getKey(noteName) !== null)
    {
        floatingWindow
        ({
            title: 'Nota duplicada',
            text: `Ya existe una nota con el nombre '${noteName}'`,
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