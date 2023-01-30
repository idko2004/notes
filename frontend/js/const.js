const path = 'http://localhost:8888';

const noteSection = document.getElementById('noteSection');

const topBar = document.getElementById('topBar');
const topBarButtons = document.getElementById('topBarButtons');
const noteName = document.getElementById('noteName');
const textArea = document.getElementById('noteField');
const sayThings = document.getElementById('sayThings');
const nav = document.getElementById('nav');

const leftToTheNoteNameButtons = document.getElementById('leftToTheNoteNameButtons');
const showNotesListButton = document.getElementById('showNotesListButton');

const leftBar = document.getElementById('leftBar');
const leftBarTitle = document.getElementById('leftBarTitle');

const newNote = document.getElementById('newNote');

const notesList = document.getElementById('notesList');
const dontNotes = document.getElementById('youDontHaveNotes');

const loadingScreen = document.getElementById('loadingScreen');

const titleTextIDLang = 'noteAppName';

let showTheNote = true;
let canInteract = true;

let isLocalMode = true;
let actualNoteIsLocal = false;
let theSecretThingThatNobodyHasToKnow;
let deviceID;
let localCopy;
let actualNoteID;
let actualNoteName;
let theActualThing;