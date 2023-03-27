let actualLanguage;

const supportedLanguages = ['es', 'en'];

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
        es: 'Preferencias y datos de la cuenta',
        en: 'Preferences and account data'
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
        en: 'Woops...'
    },
    load_fail:
    {
        es: 'Parece que algo salió mal.\nPuedes recargar la página para ver si vuelve a funcionar, o usar el modo local, solo ten en cuenta que tus notas no se subirán a la nube.\n\n(Por el momento estamos usando un hosting gratuido, por lo que el servidor puede no estar disponible por un tiempo).',
        en: 'Looks like something went wrong.\nYou can reload to look if it works again, or use the local mode, just be aware your notes are not going to be saved in the cloud.\n\n(At the moment we are using a free hosting, so it may be down for a while.)'
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
        en: 'Logging in...'
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
        es: 'Si aún no tienes una cuenta puedes crear una. En caso de que ya tengas una, revisa que el nombre de usuario o correo electrónico esté bien escrito.',
        en: "If you do not have an account, you can create one. In case you already have an account, check if the username or email address is correct."
    },
    login_error_text:
    {
        es: 'Hubo un error al iniciar sesión',
        en: 'There was an error trying to log in'
    },
    serverDown:
    {
        es: 'Parece que el servidor se ha caído, prueba a intentarlo de nuevo más tarde.\n\n(Por el momento estamos usando un hosting gratuido, por lo que el servidor puede no estar disponible por un tiempo).',
        en: 'Looks like our server went down, please try again later\n\n(At the moment we are using a free hosting, so it may be down for a while.)'
    },
    someoneAccount:
    {
        es: 'Cuenta de alguien',
        en: "Someone's account"
    },
    logginOut:
    {
        es: 'Cerrando sesión...',
        en: 'Logging out...'
    },
    menu_eraseAllLocal_title:
    {
        es: '¿Borrar todos los datos locales?',
        en: "Delete all local data?"
    },
    menu_eraseAllLocal_text:
    {
        es: 'Se borrarán todos los datos que se hayan guardado en este navegador',
        en: "All data saved in this browser will be deleted."
    },
    menu_eraseAllLocal_btn1:
    {
        es: 'No borrar nada',
        en: "Don't delete anything"
    },
    menu_eraseAllLocal_btn2:
    {
        es: 'Borrar todo',
        en: 'Delete all'
    },
    menu_reallyEraseAll_title:
    {
        es: '¿De verdad vas a borrarlo todo?',
        en: "Are you going to delete everything?"
    },
    menu_reallyEraseAll_btn1:
    {
        es: '¡De verdad voy a borrarlo todo!',
        en: "I'm going to delete everything!"
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
        es: 'Demasiado largo',
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
        en: 'An unknown error has occurred. It does not even have an error code.'
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
        es: 'Espera un momento...',
        en: 'Wait a moment...'
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
    },
    createAccountNotes:
    {
        es: 'Crear Cuenta | Notas',
        en: 'Create account | Notes'
    },
    next:
    {
        es: 'Siguiente',
        en: 'Next'
    },
    changeEmail:
    {
        es: 'Cambiar correo electrónico',
        en: 'Change Email'
    },
    back:
    {
        es: 'Volver',
        en: 'Back'
    },
    pageToReload:
    {
        es: 'La página se recargará.',
        en: 'The page will reload.'
    },
    email:
    {
        es: 'Correo electrónico',
        en: 'Email'
    },
    emailExample:
    {
        es: 'alguien@email.com',
        en: 'someone@email.com'
    },
    fieldCannotBeEmpty:
    {
        es: 'El campo no puede estar vacío.',
        en: 'The field cannot be empty.'
    },
    invalidEmail:
    {
        es: 'El correo electrónico no es válido.',
        en: 'The email is not valid.'
    },
    hyperSecurePassword:
    {
        es: 'Una contraseña híper segura',
        en: 'A hyper secure password'
    },
    passwordMustContains:
    {
        es: 'La contraseña debe contener mayúsculas, minúsculas, números y debe tener 8 o más caracteres.',
        en: 'The password must contain uppercase, lowercase, numbers and must be 8 or more characters long.'
    },
    tooLongPassword:
    {
        es: 'La contraseña es demasiado larga. (Máximo 20 caracteres)',
        en: 'The password is too long. (Maximum 20 characters)'
    },
    tooShortPassword:
    {
        es: 'La contraseña es demasiado corta. (Mínimo 8 caracteres)',
        en: 'The password is too short. (Minimun 8 characters)'
    },
    confirmPassword:
    {
        es: 'Confirmar contraseña',
        en: 'Confirm password'
    },
    typeItAgain:
    {
        es: 'Vuelve a escribirlo',
        en: 'Type it again'
    },
    typeTheSamePasswordAsBefore:
    {
        es: 'Escriba la misma contraseña que escribió antes.',
        en: 'Type the same password you typed before.'
    },
    passwordsDontMatch:
    {
        es: 'Las contraseñas no coinciden.',
        en: "The passwords don't match."
    },
    oneFieldInvalid:
    {
        es: 'Uno de los campos no es válido',
        en: 'One of the fields is not valid'
    },
    startOverAgain:
    {
        es: 'Tendremos que volver a empezar el proceso.',
        en: 'We will have to start the process all over again.'
    },
    checkYourEmail:
    {
        es: 'Revisa tu correo',
        en: 'Check your email'
    },
    codeWeSent:
    {
        es: 'Introduce el código que enviamos a',
        en: 'Introduce the code we sent to'
    },
    codesWeSent:
    {
        es: 'Introduce los códigos que enviamos a',
        en: 'Introduce the codes we sent to'
    },
    emailDuplicated:
    {
        es: 'Ya existe una cuenta con este correo.',
        en: 'An account with this email already exists.'
    },
    introduceAValidCode:
    {
        es: 'Introduce un código válido.',
        en: 'Introduce a valid code.'
    },
    introduceAValidCode2:
    {
        es: 'Uno de los códigos que has introducido es incorrecto. Revisa si los has escrito bien (no confundas el número 0 con la letra O)',
        en: 'One code you have entered is incorrect. Check if you have written them correctly (do not confuse the number 0 with the letter O).'
    },
    accountCreated:
    {
        es: '¡Ya tienes una cuenta!',
        en: 'Now you have an account!'
    },
    accountCreated2:
    {
        es: 'Vuelve a la página principal para inciar sesión en tu nueva cuenta.',
        en: "Return to the home page to log in to your new account."
    },
    manageAccountNotes:
    {
        es: 'Preferencias y datos de la cuenta | Notas',
        en: 'Preferences and account data | Notes'
    },
    modifyThisData:
    {
        es: 'Modificar estos datos',
        en: 'Modify this data'
    },
    changeLanguage:
    {
        es: 'Cambiar idioma',
        en: 'Change language'
    },
    changeLanguage2:
    {
        es: 'Cambiar idioma (Language)',
        en: 'Change language (Idioma)'
    },
    whoCanAccess:
    {
        es: 'Ver quién tiene acceso a esta cuenta',
        en: 'Who can access to this account'
    },
    logOutInAll:
    {
        es: 'Cerrar sesión en todos los dispositivos',
        en: 'Log out in all devices'
    },
    deleteAllNotes:
    {
        es: 'Borrar todas las notas',
        en: 'Delete all notes'
    },
    deleteAccount:
    {
        es: 'Borrar cuenta',
        en: 'Delete account'
    },
    modifyData:
    {
        es: 'Modificar datos de la cuenta',
        en: 'Modify account data'
    },
    saveChanges:
    {
        es: 'Guardar cambios',
        en: 'Save changes'
    },
    usernameTooLong:
    {
        es: 'El nombre de usuario es demasiado largo.',
        en: 'The username is too long.'
    },
    nothingChange:
    {
        es: 'Nada ha cambiado',
        en: 'Nothing has changed'
    },
    nothingChange2:
    {
        es: 'Modifica algún dato para poder actualizar tu perfil, si no quieres modificar nada haz click en el botón "Cancelar"',
        en: 'Modify any data to update your profile, or if you don\'t want to modify anything click on the "Cancel" button.'
    },
    itIsOk:
    {
        es: '¿Está bien así?',
        en: 'Is it OK?'
    },
    cancelButWithNo:
    {
        es: 'No, cancelar',
        en: 'No, cancel'
    },
    yesSaveTheseChanges:
    {
        es: 'Sí, guarda estos cambios',
        en: 'Yes, save these changes'
    },
    accountUpdated:
    {
        es: '¡Los datos de tu cuenta han sido actualizados!',
        en: 'Your account information has been updated!'
    },
    backToHome:
    {
        es: 'Volver al inicio',
        en: 'Back to home'
    },
    oneLastStep:
    {
        es: 'Un último paso',
        en: 'One last step'
    },
    confirmEmailAgain:
    {
        es: 'Debido a que has cambiado tu correo electrónico, debemos comprobar que también tengas acceso a este, por lo que te enviaremos otro código al nuevo correo.',
        en: 'Because you have changed your email address, we need to check that you also have access to this one, so we will send you another code to the new email address.'
    },
    enterTheCode:
    {
        es: 'Introduce el código',
        en: 'Enter the code'
    },
    enterTheCodes:
    {
        es: 'Introduce los códigos',
        en: 'Enter the codes'
    },
    verify:
    {
        es: 'Comprobar',
        en: 'Verify'
    },
    logOutAllQ:
    {
        es: '¿Quieres cerrar sesión en todos tus dispotivos?',
        en: 'Do you want to log out from all your devices?'
    },
    logOutAllQ2:
    {
        es: 'Tendrás que volver a iniciar sesión en los dispositivos en los que quieras usar Notas, incluido este.',
        en: 'You will need to log in again on the devices you want to use Notes on, including this one.'
    },
    saveNote:
    {
        es: 'Guardar nota',
        en: 'Save note'
    },
    deleteNote:
    {
        es: 'Borrar nota',
        en: 'Delete note'
    },
    downloadNote:
    {
        es: 'Descargar nota',
        en: 'Download note'
    },
    renameNote:
    {
        es: 'Renombrar nota',
        en: 'Rename note'
    },
    deleteTheAccount:
    {
        es: 'Borrar la cuenta %',
        en: "Delete %'s account"
    },
    accountDeleted:
    {
        es: 'Tu cuenta ha sido eliminada.',
        en: 'Your account has been deleted.'
    },
    localCopySettings:
    {
        es: 'Configuración de copias locales',
        en: 'Local copy configuration'
    },
    localCopyText1:
    {
        es: 'Cuando las copias locales están activadas, se guarda una copia de tus notas que puede ser vista en el modo local. Así, en el caso de que los servidores dejen de estar disponibles, o el dispositivo no disponga de internet, las notas puedan seguir siendo guardadas.',
        en: 'When local copies are enabled, a copy of your notes is saved and can be viewed in local mode. Thus, in case the servers become unavailable, or the device does not have internet access, the notes can still be saved.'
    },
    localCopyText2:
    {
        es: 'Sin embargo, esto implica que tus notas pueden ser visibles en el modo local, incluso al cerrar sesión.',
        en: 'However, this implies that your notes can still be visible in local mode, even when you log out.'
    },
    localCopyText3:
    {
        es: 'Al desactivar las copias locales ya no se guardarán tus notas en el modo local.',
        en: 'Disabling local copies will no longer save your notes in local mode.'
    },
    localCopyText4:
    {
        es: 'Si quieres mantener las copias locales, pero no quieres que tus notas sean accesibles al cerrar sesión, puedes borrar todas las notas en el modo local luego de haber cerrado la sesión de tu cuenta.',
        en: 'If you want to keep local copies, but do not want your notes to be accessible when you log out, you can delete all notes in local mode after you have logged out of your account.'
    },
    localCopiesAre:
    {
        es: 'Las copias locales están',
        en: 'Local copies are'
    },
    enabled:
    {
        es: 'activadas',
        en: 'enabled'
    },
    enabled2:
    {
        es: 'activada',
        en: 'enabled'
    },
    enable:
    {
        es: 'Activar',
        en: 'Enable'
    },
    disabled:
    {
        es: 'desactivadas',
        en: 'disabled'
    },
    disabled2:
    {
        es: 'desactivada',
        en: 'disabled'
    },
    disable:
    {
        es: 'Desactivar',
        en: 'Disable'
    },
    disableLocalCopy:
    {
        es: 'Desactivar copias locales',
        en: 'Disable local copies'
    },
    enableLocalCopy:
    {
        es: 'Activar copias locales',
        en: 'Enable local copies'
    },
    saveAndExit:
    {
        es: 'Guardar cambios y salir',
        en: 'Save changes and exit'
    },
    localFound1:
    {
        es: 'Copia local encontrada',
        en: 'Local copy found'
    },
    localFound2:
    {
        es: 'No fue posible conectarse con el servidor, sin embargo está disponible una copia local de la nota, para utilizarla tenga en cuenta lo siguiente:\n\n- Puede que el contenido de la nota sea algo antiguo.\n- La próxima vez que quiera ver la nota tendrá que hacerlo a través del modo local.',
        en: 'It was not possible to connect to the server, however a local copy of the note is available, to use it please note the following:\n\n- The content of the note may be old.\n- The next time you want to view the note you will have to do it through the local mode.'
    },
    viewLocalCopy:
    {
        es: 'Ver copia local',
        en: 'View local copy'
    },
    errorAlert:
    {
        es: 'HA OCURRIDO UN ERROR, para ayudar a corregirlo, por favor siga los siguientes pasos:\n(Lea todas las instrucciones antes de cerrar esta ventana)\n\n- Haga click derecho y seleccione la opción inspeccionar o inspeccionar elemento\n\n- Dirígase a la pestaña consola\n\n- Si ve un mensaje en rojo y este tiene una flecha a la izquierda, por favor expanda el mensaje\n\n- Tome una captura de pantalla y por favor envíela a idkotest@gmail.com junto con una explicación de que estaba haciendo antes del error.\n\nGracias.',
        en: 'AN ERROR HAS OCCURRED, to help correct it, please follow the steps below:\n(Read all instructions before closing this window).\n\n- Right click and select the inspect or inspect element option.\n\n- Go to the console tab\n\n- If you see a message in red and it has an arrow on the left, please expand the message.\n\n- Take a screenshot and please send it to idkotest@gmail.com along with an explanation of what you were doing before the error.\n\nThank you.'
    },
    creatingNote:
    {
        es: 'Creando nota...',
        en: 'Creating note...'
    },
    renaming:
    {
        es: 'Renombrando...',
        en: 'Renaming...'
    },
    changeColorTheme:
    {
        es: 'Cambiar tema de color',
        en: 'Change color theme'
    },
    lightTheme:
    {
        es: 'Tema claro',
        en: 'Light theme'
    },
    darkTheme:
    {
        es: 'Tema oscuro',
        en: 'Dark theme'
    },
    lightThemeWillBeApplied:
    {
        es: 'Se aplicará el tema claro',
        en: 'Light theme will be applied'
    },
    darkThemeWillBeApplied:
    {
        es: 'Se aplicará el tema oscuro',
        en: 'Dark theme will be applied'
    },
    saveToApplyTheme:
    {
        es: 'Tu tema se aplicará cuando apliques los cambios y vuelvas a la pantalla principal.',
        en: 'Your theme will be applied when you save your changes and return to the main screen'
    },
    unableToLogIn:
    {
        es: 'No es posible iniciar sesión debido a que no se pudo conectar con el servidor.',
        en: 'Unable to log in due to failed server connection.'
    },
    preferences:
    {
        es: 'Preferencias',
        en: 'Preferences'
    },
    continue:
    {
        es: 'Continuar',
        en: 'Continue'
    },
    reenter:
    {
        es: 'Vuelve a ingresar',
        en: 'Re-enter'
    },
    reenter_createAccount:
    {
        es: 'Vuelve a elegir la opción "Crear cuenta" en la página principal.',
        en: 'Choose again the "Create account" option on the main page.'
    },
    reenter_manageAccount:
    {
        es: 'Vuelve a elegir la opción "Preferencias" en la página principal.',
        en: 'Choose again the "Preferences" option on the main page.'
    },
    deleteConfigurationData:
    {
        es: 'Borrar datos de configuración',
        en: 'Delete configuration data'
    },
    doYouWantToDeleteYourAccount:
    {
        es: '¿Quieres borrar tu cuenta?',
        en: 'Do you want to delete your account?'
    },
    deleteAccountText1:
    {
        es: 'Al borrar tu cuenta se borrarán todas tus notas y ya no podrás acceder a ellas de forma online.',
        en: 'Deleting your account will delete all your notes and you will no longer be able to access them online.'
    },
    deleteAccountText2:
    {
        es: 'Todos los dispositivos en los que hayas iniciado sesión seguirán teniendo copias de las notas que hayas editado en ese dispositivo y pueden ser vistas en el modo local. De igual forma es recomendable descargar las notas que desee conservar.',
        en: 'All devices on which you are logged in will still have copies of the notes you have edited on that device and can be viewed in local mode. It is also advisable to download any notes you wish to keep.'
    },
    deleteAccountText3:
    {
        es: 'Para confirmar el cierre de tu cuenta, ingresa el código que enviamos al correo electrónico ',
        en: 'To confirm the closure of your account, please enter the code we sent to the email address '
    },
    deleteConfigText:
    {
        es: 'Se borrarán todos los datos de configuración, tus notas se mantendrán a salvo.',
        en: 'All configuration data will be deleted, your notes will be kept safe.'
    },
    deleteAllText:
    {
        es: 'Se borrarán todos los datos locales, tus notas seguirán a salvo en tu cuenta, pero se borrarán sus copias locales. Tus configuraciones también serán borradas.',
        en: 'All local data will be deleted, your notes will still be safe in your account, but their local copies will be deleted. Your settings will also be deleted.'
    },
    deleteConfigQuestion:
    {
        es: '¿Borrar configuraciones?',
        en: 'Delete configuration data?'
    },
    spellcheck:
    {
        es: 'Corrector ortográfico',
        en: 'Spellcheck'
    },
    spellcheckText:
    {
        es: 'Activa o desactiva el corrector ortográfico al escribir notas. Esta función es gestionada por el navegador.',
        en: 'Enables or disables the spell checker when writing notes. This function is managed by the browser.'
    },
    spellcheckIs:
    {
        es: 'La corrección ortográfica está',
        en: 'Spellcheck is'
    },
    configuredByBrowserDefaults:
    {
        es: 'configurada por los valores predeterminados del navegador',
        en: 'configured by browser defaults'
    },
    defaultConfiguration:
    {
        es: 'Configuración por defecto',
        en: 'Default configuration'
    },
    askToLogOut:
    {
        es: '¿Quieres cerrar tu sesión de notas?',
        en: 'Do you want to close your notes session?'
    },
    keepSessionOpen:
    {
        es: 'Mantener la sesión abierta',
        en: 'Keep session open'
    },
    kradTheme:
    {
        es: 'Tema oscuro invertido',
        en: 'Dark theme inverted'
    },
    kradThemeWillBeApplied:
    {
        es: 'Se aplicará el tema oscuro invertido',
        en: 'Dark theme inverted will be applied'
    },
    usernameDuplicated:
    {
        es: 'Ya existe una cuenta con este nombre de usuario.\n\n(Prueba añadiendo un número o algo).',
        en: 'An account with this username already exists.\n\n(Try adding a number or something).'
    },
    and:
    {
        es: 'y',
        en: 'and'
    },
    showNotesList:
    {
        es: 'Mostrar lista de notas',
        en: 'Show notes list'
    }
}

languageAtStart();

function getText(textID, replaceArray)
{
    console.log('getText', textID, actualLanguage);
    
    let txtObj = allTexts[textID];
    if(txtObj === undefined)
    {
        console.error('Error al obtener textos:', textID, actualLanguage);
        return textID;
    }
    
    let text = txtObj[actualLanguage];

    if(replaceArray !== undefined) for(let i = 0; i < replaceArray.length; i++)
    {
        if(text.indexOf('%') === -1) break;
        text = text.replace('%', replaceArray[i]);
    }

    if(text === undefined) console.error('Error al obtener textos:', textID, actualLanguage);
    return text;
}

function languageAtStart()
{
    let lang = hashEquals('lang');
    if(lang === undefined) lang = getKey('_lang');

    if(['', undefined, null].includes(lang)) lang = navigator.language.split('-')[0];

    if(!supportedLanguages.includes(lang)) lang = 'en';
    
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

    document.title = getText(titleTextIDLang); //Otro script tiene que definir esta variable

    console.timeEnd('Reemplazando los textos');
}
