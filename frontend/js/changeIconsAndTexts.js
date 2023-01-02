// ICONOS

if(['dark', 'krad'].includes(colorTheme))
{
    // Iconos de la barra arriba del textarea
    document.getElementById('menuImg').src = 'img/hamburger-dark.svg';
    document.getElementById('renameImg').src = 'img/pencil-dark.svg';
    document.getElementById('downloadImg').src = 'img/download-dark.svg';
    document.getElementById('saveImg').src= 'img/upload-dark.svg';
    document.getElementById('deleteImg').src = 'img/delete-dark.svg';

    // Icono de configuración en la pantalla de inicio de sesión
    document.getElementById('loginSettings').src = 'img/settings-dark.svg';

    // Icono de crear nueva nota en la barra de la izquierda
    document.getElementById('newNote').src = 'img/newNote-dark.svg';
}
else
{
    // Iconos de la barra arriba del textarea
    document.getElementById('menuImg').src = 'img/hamburger.svg';
    document.getElementById('renameImg').src = 'img/pencil.svg';
    document.getElementById('downloadImg').src = 'img/download.svg';
    document.getElementById('saveImg').src= 'img/upload.svg';
    document.getElementById('deleteImg').src = 'img/delete.svg';

    // Icono de configuración en la pantalla de inicio de sesión
    document.getElementById('loginSettings').src = 'img/settings.svg';

    // Icono de crear nueva nota en la barra de la izquierda
    document.getElementById('newNote').src = 'img/newNote.svg';
}

// TEXTO

// botonoes de la barra arriba del textarea
document.getElementById('showNotesListButton').title = getText('showNotesList');
document.getElementById('saveButton').title = getText('saveNote');
document.getElementById('deleteButton').title = getText('deleteNote');
document.getElementById('downloadButton').title = getText('downloadNote');
document.getElementById('renameButton').title = getText('renameNote');

// Icono de crear nueva nota en la barra de la izquierda
document.getElementById('newNote').title = getText('newNote');
