textArea.value = '';
textArea.disabled = true;

async function loadNote(name, id)
{
    console.log('Cargar nota',name);
    let noteContent = null;
    if(id === undefined)
    {
        noteContent = getKey(name);
    }
    else
    {
        noteName.innerText = 'Cargando...';

        //Cargar la nota
        const response = await axios.get(`${path}/note`, {headers: {key: theSecretThingThatNobodyHasToKnow, noteid: id}});
        console.log(response);
        if(response.data.error !== undefined) //Ocurre un error
        {
            floatingWindow(
            {
                title: 'Ha ocurrido un error',
                text: 'Por favor, recarga la página.'
            });
            return;
        }
        if(response.data.note !== undefined) noteContent = response.data.note;
        else
        {
            console.error('error cargando la nota');
            return;
        }
    }

    noteName.innerText = name;
    textArea.value = noteContent;
    textArea.disabled = false;
    topBarButtons.hidden = false;

    showTheNoteInSmallScreen(true);

    setTimeout(function()
    {
        noteField.focus();
    }, 15);
}

//Botón de guardar nota
document.getElementById('saveButton').addEventListener('click',(e) =>
{
    if(!canInteract) return;

    saveNote();
    sayThings.innerText = '(Guardado).';
    setTimeout(() =>
    {
        sayThings.innerText = '';
    },1500);
});

function saveNote()
{
    if(!canInteract) return;

    let name = noteName.innerText;
    if(name === 'Haz click sobre una nota.') return;

    let value = textArea.value;
    saveKey(name, value);
}

//Botón de borrar nota
document.getElementById('deleteButton').addEventListener('click',(e) =>
{
    if(!canInteract) return;

    let name = noteName.innerText;

    floatingWindow
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

setInterval(function()
{
    console.log('Intentando guardar automáticamente.');
    if(!canInteract) return;
    if(textArea.disabled === true) return;
    
    saveNote();
    console.log('Guardado automáticamente.');

    sayThings.innerText = '(Guardado automáticamente).';
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