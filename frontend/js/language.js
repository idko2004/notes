let actualLanguage;

const allTexts =
{
    noteAppName:
    {
        es: 'Notas',
        en: 'Notes'
    },
    loading:
    {
        es: 'Cargando...',
        en: 'Loading...'
    },
    login:
    {
        es: 'Iniciar sesión',
        en: 'Log in'
    },
    username:
    {
        es: 'Nombre de usuario',
        en: 'Username'
    },
    password:
    {
        es: 'Contraseña',
        en: 'Password'
    },
    forgotPassword:
    {
        es: 'Olvidé mi contraseña',
        en: 'I forgot my password'
    },
    createAccount:
    {
        es: 'Crear cuenta',
        en: 'Create account'
    },
    localMode:
    {
        es: 'Modo local',
        en: 'Local mode'
    },
    yourNotes:
    {
        es: 'Tus notas',
        en: 'Your notes'
    },
    create:
    {
        es: 'Crear',
        en: 'Create'
    },
    youDontHaveNotes:
    {
        es: 'No tienes notas.',
        en: "You don't have notes."
    },
    clickANote:
    {
        es: 'Haz click sobre una nota.',
        en: 'Click a note.'
    },
    close:
    {
        es: 'Cerrar',
        en: 'Close'
    },
    menu_exitLocalMode:
    {
        es: 'Salir del modo local',
        en: 'Exit local mode'
    },
    menu_eraseAll:
    {
        es: 'Borrar todos los datos',
        en: 'Erase all data'
    },
    logOut:
    {
        es: 'Cerrar sesión',
        en: 'Log out'
    },
    manageAccount:
    {
        es: 'Gestionar cuenta',
        en: 'Manage account'
    },
    menu_localNotes:
    {
        es: 'Ver notas locales',
        en: 'Show local notes'
    },
    menu_about:
    {
        es: 'Acerca de notas',
        en: 'About notes'
    },
    ups:
    {
        es: 'Vaya...',
        en: 'Ups...'
    },
    load_fail:
    {
        es: 'Parece que nuestro servidor se ha caído.\nPuedes recargar la página para ver si ha vuelto, o usar el modo local, solo ten en cuenta que tus notas no se subirán a la nube.',
        en: 'Looks like our server went down.\nYou can reload to look if it works again, or use the local mode, just be aware your notes are not going to be saved in the cloud.'
    },
    tryAgain:
    {
        es: 'Reintentar',
        en: 'Try again'
    },
    somethingWentWrong:
    {
        es: 'Algo salió mal',
        en: 'Something went wrong'
    },
    errorCode:
    {
        es: 'Código de error',
        en: 'Error code'
    },
    lnl_eraseData:
    {
        es: 'Borrar datos de inicio de sesión y recargar',
        en: 'Erase login data and reload'
    },
    reload:
    {
        es: 'Recargar',
        en: 'Reload'
    },
    logginIn:
    {
        es: 'Iniciando sesión...',
        en: 'Loggin in...'
    },
    login_none_title:
    {
        es: 'Introduce tus datos',
        en: 'Introduce your data'
    },
    login_none_text:
    {
        es: 'No puedes iniciar sesión si no nos dices cuál es tu usuario y contraseña.\nSi no quieres crear una cuenta puedes probar el modo local.',
        en: "You can't log in if you don't give us your username and password.\nIf you don't want to create an account you can use the local mode."
    },
    ok:
    {
        es: 'Aceptar',
        en: 'Ok'
    },
    login_username_title:
    {
        es: '¿Cómo te llamas?',
        en: "What's your name?"
    },
    login_username_text:
    {
        es: 'Escribe tu nombre de usuario para poder iniciar sesión.',
        en: "Write your username to log in."
    },
    login_password_title:
    {
        es: '¿Cuál es tu contraseña?',
        en: "What's your password?"
    },
    login_password_text:
    {
        es: 'Sin tu contraseña no puedes iniciar sesión, si no la recuerdas podemos hacer algo para recuperarla.',
        en: "Without your password you cannot log in, if you have forgotten it we can do something to restore it."
    },
    login_wrongPassword_title:
    {
        es: 'Contraseña incorrecta',
        en: 'Wrong password'
    },
    login_wrongPassword_text:
    {
        es: 'Verifica si la has escrito correctamente o intenta con otra contraseña. Si no la recuerdas siempre puedes restablecerla.',
        en: "Check if you type it correctly or try another one. If you don't remember it you can always restore it"
    },
    login_wrongUser_title:
    {
        es: 'Este usuario no existe',
        en: "This user does not exist"
    },
    login_wrongUser_text:
    {
        es: 'Si aún no tienes una cuenta puedes crear una. En caso de que ya tengas una revisa que el nombre de usuario o correo electrónico esté bien escrito.',
        en: "If you do not have an account, you can create one. In case you already have an account, check if the username or email address is correct."
    },
    login_error_text:
    {
        es: 'Hubo un error al iniciar sesión',
        en: 'There was an error trying to log in'
    },
    serverDown:
    {
        es: 'Parece que el servidor se ha caído, prueba a intentarlo de nuevo más tarde.',
        en: 'Looks like our server went down, please try again later'
    },
    someoneAccount:
    {
        es: 'Cuenta de alguien',
        en: "Someone's account"
    },
    logginOut:
    {
        es: 'Cerrando sesión...',
        en: 'Loggin out...'
    },
    menu_eraseAllLocal_title:
    {
        es: '¿Borrar todos los datos locales?',
        en: "Erase all local data?"
    },
    menu_eraseAllLocal_text:
    {
        es: 'Se borrarán todos los datos que se hayan guardado en este navegador en el modo local.',
        en: "All data saved in the local mode in this browser will be erased."
    },
    menu_eraseAllLocal_btn1:
    {
        es: 'No borrar nada',
        en: "Don't delete anything"
    },
    menu_eraseAllLocal_btn2:
    {
        es: 'Borrar',
        en: 'Delete all'
    },
    menu_reallyEraseAll_title:
    {
        es: '¿De verdad vas a borrarlo todo?',
        en: "Are you going to erase everything?"
    },
    menu_reallyEraseAll_btn1:
    {
        es: '¡De verdad voy a borrarlo todo!',
        en: "I'm going to erase everything!"
    },
    menu_reallyEraseAll_btn2:
    {
        es: 'No voy a borrar nada',
        en: "Don't delete anything"
    },
    newNote:
    {
        es: 'Nueva nota',
        en: 'New note'
    },
    newNote_text:
    {
        es: '¿Qué nombre le pondrás a tu nueva nota?',
        en: "How will your new note be called?"
    },
    cancel:
    {
        es: 'Cancelar',
        en: 'Cancel'
    },
    createNote:
    {
        es: 'Crear nota',
        en: 'Create note'
    },
    newNote_invalidName_title:
    {
        es: 'Elige otro nombre',
        en: 'Choose another name'
    },
    newNote_invalidName_text:
    {
        es: 'El nombre que le has puesto a esta nota no es válido, intenta con otro.',
        en: 'The name you have chosen for the note is not valid, try another one.'
    },
    newNote_emptyName_title:
    {
        es: 'Escribe un nombre',
        en: 'Write a name'
    },
    newNote_emptyName_text:
    {
        es: 'La nota no puede tener un nombre vacío.',
        en: 'The note cannot have an empty name'
    },
    newNote___:
    {
        es: 'El nombre de la nota no puede empezar con "_"',
        en: "The name of the note can't start with '_'"
    },
    newNote_tooLongName_title:
    {
        es: 'Acorta el nombre',
        en: 'Too long'
    },
    newNote_tooLongName_text:
    {
        es: 'El nombre de la nota es demasiado largo.',
        en: "The name of the note is too long."
    },
    newNote_duplicated_title:
    {
        es: 'Nota duplicada',
        en: 'Duplicated note'
    },
    newNote_duplicated_text:
    {
        es: 'Ya existe una nota con el nombre',
        en: 'There is already a note with the name'
    },
    savingNote:
    {
        es: '(Guardando nota...)',
        en: '(Saving note...)'
    },
    loadNoteFailed:
    {
        es: 'No se pudo cargar la nota.',
        en: "Can't load the note."
    },
    noErrorCode:
    {
        es: 'Ha ocurrido un error desconocido. Ni siquiera existe un código de error para esto.',
        en: 'An unknown error has occurred. It does not even have an error code'
    },
    saved:
    {
        es: '(Guardado)',
        en: '(Saved)'
    },
    saveFailed:
    {
        es: '(Error al guardar)',
        en: "(Can't save)"
    },
    deleteNote_title:
    {
        es: '¿Borrar nota?',
        en: 'Delete note?'
    },
    deleteNote_text:
    {
        es: '¿Estás seguro que quieres borrar la nota %?\nSi la borras se irá para siempre.',
        en: "Are you sure you want to delete the note %?\nIt will be gone forever."
    },
    deleteNote_btn1:
    {
        es: 'No, quiero conservarla',
        en: 'No, I want to keep it'
    },
    deleteNote_btn2:
    {
        es: 'Sí, borra la nota',
        en: 'Yes, delete the note'
    },
    deletingNote:
    {
        es: 'Borrando nota...',
        en: 'Deleting note...'
    },
    waitAMoment:
    {
        es: 'Espera un momento.',
        en: 'Wait a moment.'
    },
    autosave:
    {
        es: '(Guardando automáticamente...)',
        en: '(Saving automatically...)'
    },
    rename_title:
    {
        es: 'Renombrar la nota',
        en: 'Rename note'
    },
    rename_text:
    {
        es: 'Elige un nuevo nombre para la nota',
        en: 'Choose a new name for the note'
    },
    rename_btn1:
    {
        es: 'Dejarlo como estaba',
        en: "Don't change the name"
    },
    rename_btn2:
    {
        es: 'Renombrar',
        en: 'Rename'
    }
}

languageAtStart();

function getText(textID, replaceArray)
{
    console.log('getText', textID, actualLanguage);
    
    let txtObj = allTexts[textID];
    if(txtObj === undefined) return undefined;
    
    let text = txtObj[actualLanguage];

    if(replaceArray !== undefined) for(let i = 0; i < replaceArray.length; i++)
    {
        if(text.indexOf('%') === -1) break;
        text = text.replace('%', replaceArray[i]);
    }

    return text;
}

function languageAtStart()
{
    let lang = getKey('_lang');
    if(lang === '') lang = navigator.language.split('-')[0];

    actualLanguage = lang;

    console.time('Reemplazando los textos');
    const elementsWithText = document.getElementsByClassName('text');
    for(let i = 0; i < elementsWithText.length; i++)
    {
        let textID = elementsWithText[i].attributes.txt.value;
        if(textID === undefined) continue;

        let text = getText(textID);
        elementsWithText[i].innerText = text;
    }
    console.timeEnd('Reemplazando los textos');
}
