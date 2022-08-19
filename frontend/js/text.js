let textHistory = [];
let textHistoryIndex = 0;
let theVeryLestHistoryIndex = 0;
let lastHistorySaved = 0;

let maxHistoryItems = 40;

textArea.addEventListener('keydown', (e) =>
{
    if(!canInteract)
    {
        if(e.key !== 'Tab') e.preventDefault();
        return;
    }
    if(theActualThing !== 'note') return;

    let start = textArea.selectionStart;
    let end = textArea.selectionEnd;

    //Guardar para poder hacer control z
    saveInHistory();

    if(start !== end) return;

    // Listas
    if(e.key === 'Enter' || e.key === 'Return')
    {
        let before = textArea.value.slice(0, textArea.selectionStart);
        let after = textArea.value.slice(textArea.selectionStart);

        let beforeSplit = before.split('\n');
        let lastLine = beforeSplit[beforeSplit.length - 1];

        if(lastLine.startsWith('- ')) addToField('\n- ', before, after);
        else if(lastLine.startsWith('-')) addToField('\n-', before, after);
        else if(lastLine.startsWith('* ')) addToField('\n* ', before, after);
        else if(lastLine.startsWith('*')) addToField('\n*', before, after);
        else if(!isNaN(parseInt(lastLine[0])))
        {
            //Si el primer caractér de la línea es un número.
            let n = getTheNumber(lastLine);
            if(lastLine.startsWith(`${n}- `)) addToField(`\n${++n}- `, before, after);
            else if(lastLine.startsWith(`${n}-`)) addToField(`\n${++n}-`, before, after);
            else if(lastLine.startsWith(`${n} - `)) addToField(`\n${++n} - `, before, after);
            else if(lastLine.startsWith(`${n} -`)) addToField(`\n${++n} -`, before, after);
            else if(lastLine.startsWith(`${n}. `)) addToField(`\n${++n}. `, before, after);
            else if(lastLine.startsWith(`${n}.`)) addToField(`\n${++n}.`, before, after);
            else if(lastLine.startsWith(`${n}) `)) addToField(`\n${++n}) `, before, after);
            else if(lastLine.startsWith(`${n})`)) addToField(`\n${++n})`, before, after);
            else if(lastLine.startsWith(`${n} ) `)) addToField(`\n${++n} ) `, before, after);
            else if(lastLine.startsWith(`${n} )`)) addToField(`\n${++n} )`, before, after);
        }
    }

    function getTheNumber(lastLine)
    {
        let lastNum = '';
        for(let i = 0; i < lastLine.length; i++)
        {
            if(!isNaN(parseInt(lastLine[i])))
            {
                lastNum += lastLine[i];
            }
            else break;
        }

        return parseInt(lastNum);
    }

    //Tabulaciones
    if(e.key === 'Tab')
    {
        let before = textArea.value.slice(0, textArea.selectionStart);
        let after = textArea.value.slice(textArea.selectionStart);

        addToField('    ', before, after);
    }

    //Quitar el foco
    if(e.key === 'Escape')
    {
        document.getElementById('renameButton').focus();
    }

    //Guardar
    if(e.ctrlKey && e.key === 's')
    {
        e.preventDefault();
        document.getElementById('saveButton').click();
    }

    //Deshacer
    if(e.ctrlKey && e.key === 'z')
    {
        e.preventDefault();

        let toRestore = textHistory[textHistoryIndex];
        console.log('toRestore', textHistoryIndex, toRestore);
        
        if(toRestore === undefined) return;

        console.log('lastHistorySaved', lastHistorySaved);
        if(toRestore.index !== lastHistorySaved) return;

        textArea.value = toRestore.text;
        textArea.selectionStart = toRestore.start;
        textArea.selectionEnd = toRestore.end;

        lastHistorySaved--;
        textHistoryIndex--;
        if(textHistoryIndex < 0) textHistoryIndex = textHistory.length - 1;

        //console.log(textHistory);
        //console.log(textHistoryIndex);
    }

    //Rehacer
    if(e.ctrlKey && e.key === 'y')
    {
        let toRestore = textHistory[theVeryLestHistoryIndex];
        console.log('toRestore', theVeryLestHistoryIndex, toRestore);

        if(toRestore === undefined) return;

        textArea.value = toRestore.text;
        textArea.selectionStart = toRestore.start;
        textArea.selectionEnd = toRestore.end;

        textHistoryIndex = theVeryLestHistoryIndex - 1;
        lastHistorySaved = toRestore.index - 1;

        //console.log(textHistory);
        //console.log('textHistoryIndex', textHistoryIndex);
        //console.log('lastHistorySaved', lastHistorySaved);
    }

    function addToField(toAdd, before, after)
    {
        e.preventDefault();
        textArea.value = before + toAdd + after;

        textArea.selectionStart = start + toAdd.length;
        textArea.selectionEnd = start + toAdd.length;
    }

    function saveInHistory()
    {
        if(['Enter', ' ', 'Backspace', 'Tab'].includes(e.key) || e.ctrlKey && e.key === 'v')
        {
            textHistoryIndex++;

            if(textHistoryIndex > maxHistoryItems) textHistoryIndex = 0;

            let i = textHistoryIndex;
            theVeryLestHistoryIndex = textHistoryIndex;
    
            lastHistorySaved++;
            textHistory[i] = {text: textArea.value, start, end, index: lastHistorySaved};

            //console.log(textHistory);
            //console.log(textHistoryIndex);
        }
    }
});
