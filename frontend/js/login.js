document.getElementById('localModeButton').addEventListener('click',function()
{
    loadNotesList();
    document.getElementById('loginScreen').hidden = true;

    document.getElementById('noteScreen').hidden = false;
    resizeTwice();

    saveKey('_login','local');
});